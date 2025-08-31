import { BLOCK_TYPE_IMAGE } from '@/lib/constants';
import * as cloudinaryClient from '@/lib/cloudinary';
import NotionClient from '@/lib/notion';
import downloadImageToBase64 from '@/lib/utils';
import { getImageUrlToUploadFromNotionImageDescriptor, generateCloudinaryFilename } from '@/lib/utils';
import Logger from '@/lib/logger';
import { GetPageResponse} from '@notionhq/client/build/src/api-endpoints';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Debug: Check if environment variables are loaded
//console.log('Environment variables check:');
//console.log('NOTION_TOKEN:', process.env.NOTION_TOKEN ? 'SET' : 'NOT SET');
//console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'SET' : 'NOT SET');
//console.log('NOTION_DB_ID:', process.env.NOTION_DB_ID ? 'SET' : 'NOT SET');

// Helper function to check if URL is already a Cloudinary URL
function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export default async function uploadNotionImagesToCloudinary({
  notionToken = process.env.NOTION_TOKEN || '',
  notionDatabaseId = process.env.NOTION_DATABASE_ID || undefined,
  notionPageId = undefined,
  cloudinaryUrl = process.env.CLOUDINARY_URL || '',
  cloudinaryUploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || '',
  logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  uploadExternalsNotOnCloudinary = process.env.UPLOAD_EXTERNALS_NOT_ON_CLOUDINARY
    ? process.env.UPLOAD_EXTERNALS_NOT_ON_CLOUDINARY === '1'
    : false,
}: {
  notionToken: string;
  cloudinaryUrl: string;
  cloudinaryUploadFolder?: string;
  logLevel: 'none' | 'error' | 'info' | 'debug';
  uploadExternalsNotOnCloudinary?: boolean;
} & (
  | { notionDatabaseId: string; notionPageId?: undefined }
  | { notionDatabaseId?: undefined; notionPageId: string }
)) {
  if (!notionToken) {
    throw new Error(`Missing argument notionToken. Pass it or set it as the env var NEXT_PUBLIC_NOTION_TOKEN`);
  }
  if (!notionDatabaseId && !notionPageId) {
    throw new Error(
      `Missing both arguments notionDatabaseId and notionPageId. Pass one of them it or set the database ID in an env var NEXT_PUBLIC_NOTION_DATABASE_ID`,
    );
  }
  if (!cloudinaryUrl) {
    throw new Error(`Missing cloudinaryUrl. Pass it or set it as the env var NEXT_PUBLIC_CLOUDINARY_URL`);
  }

  try {
    cloudinaryClient.config({ cloudinaryUrl });
  } catch (error) {
    throw new Error(`Failed to configure Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const log = new Logger(logLevel);

  log.debug(`Params`, { uploadExternalsNotOnCloudinary });

  const notionClient = new NotionClient(notionToken, log);

  log.debug(
    notionPageId
      ? `Fetching page ${notionPageId}`
      : notionDatabaseId
        ? `Fetching pages of database ${notionDatabaseId}`
        : 'Missing page or database ID',
  );

  let pages: GetPageResponse[] = [];
  
  try {
    pages = notionPageId
      ? [await notionClient.getPage(notionPageId)]
      : notionDatabaseId
        ? await notionClient.getPagesFromDatabase(notionDatabaseId)
        : [];
  } catch (error) {
    throw new Error(`Failed to fetch pages from Notion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  if (pages.length === 0) {
    log.info('No pages found to process');
    return;
  }

  log.info(`Processing ${pages.length} page(s)`);

  for (const page of pages) {
    try {
      // find the title of the page in properties where the object.id is of type title
      let title: string | undefined;

      if ('properties' in page) {
        Object.entries(page.properties).some(([, prop]) => {
          if (prop && prop.type === 'title') {
            title = prop.title.map((t) => t.plain_text).join('');
            return true;
          }
        });
      }

      log.debug(`${page.id}: title: ${title}`);

      ////////////////////
      // cover
      ////////////////////
      try {
        const coverUrl = getImageUrlToUploadFromNotionImageDescriptor({
          image: 'cover' in page ? page.cover : undefined,
          uploadExternalsNotOnCloudinary,
        });

        if (!coverUrl) {
          log.debug(`${page.id}: cover image is already good ✔`);
        } else if (isCloudinaryUrl(coverUrl)) {
          log.debug(`${page.id}: cover image is already on Cloudinary ✔`);
        } else {
          log.info(`${page.id}: uploading cover image to Cloudinary`);

          const coverImage = await downloadImageToBase64(coverUrl);
          if (!coverImage) {
            log.error(`${page.id}: failed to download cover image`);
          } else {
            log.debug('Cover image downloaded');

            const filenameFromTitle = generateCloudinaryFilename(coverUrl, title, 'cover');

            const { url: coverExternalUrl } = await cloudinaryClient.uploadImage(
              `data:image/jpeg;base64,${coverImage}`,
              {
                folder: `${cloudinaryUploadFolder}/${title}_${page.id}`,
                public_id: filenameFromTitle,
                overwrite: false, // Don't overwrite if already exists
              },
            );
            log.debug('Cover image uploaded to Cloudinary');

            await notionClient.updatePageCoverExternalUrl(page.id, coverExternalUrl);
            log.info(`${page.id}: cover image copied to Cloudinary and asset updated in Notion ✅`);
          }
        }
      } catch (error) {
        log.error(`${page.id}: failed to process cover image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      ////////////////////
      // files
      ////////////////////
      try {
        let filesPropertyName: string | undefined;
        let fileUrls: Array<{ name: string; url: string; originalUrl: string }> = [];

        // Find the files property and extract file information
        if ('properties' in page) {
          Object.entries(page.properties).forEach(([propertyName, prop]) => {
            if (prop && prop.type === 'files') {
              filesPropertyName = propertyName;
              fileUrls = prop.files?.map((file: any) => ({
                name: file.name,
                url: file.file?.url || file.external?.url || '',
                originalUrl: file.file?.url || file.external?.url || ''
              })).filter(file => file.url !== '') || [];
            }
          });
        }

        if (!filesPropertyName || fileUrls.length === 0) {
          log.debug(`${page.id}: no files property or no files found`);
        } else {
          log.debug(`${page.id}: found ${fileUrls.length} files in property '${filesPropertyName}'`);
          
          let hasUpdates = false;
          const updatedFiles = [];

          for (const fileInfo of fileUrls) {
            try {

              const fileTitle = fileInfo.name;
              const fileOriginalUrl = fileInfo.url;

              log.debug(`${page.id}: processing file: ${fileTitle} (${fileOriginalUrl})`);
              
              // Skip if already on Cloudinary
              if (isCloudinaryUrl(fileOriginalUrl)) {
                log.debug(`${page.id}: file '${fileTitle}' is already on Cloudinary ✔`);
                updatedFiles.push({ name: fileTitle, url: fileOriginalUrl });
                continue;
              }

              // Check if we should upload this external URL
              if (!uploadExternalsNotOnCloudinary && fileOriginalUrl.startsWith('http')) {
                log.debug(`${page.id}: skipping external file '${fileTitle}' (uploadExternalsNotOnCloudinary is false)`);
                updatedFiles.push({ name: fileTitle, url: fileOriginalUrl });
                continue;
              }

              log.info(`${page.id}: uploading file '${fileTitle}' to Cloudinary`);

              const fileImage = await downloadImageToBase64(fileOriginalUrl);
              if (!fileImage) {
                log.error(`${page.id}: failed to download file '${fileTitle}': ${fileOriginalUrl}`);
                updatedFiles.push({ name: fileTitle, url: fileOriginalUrl }); // Keep original URL
                continue;
              }
              log.debug(`File '${fileTitle}' downloaded`);

              // Generate a consistent filename for Cloudinary
              const cloudinaryFilename = generateCloudinaryFilename(fileOriginalUrl, fileTitle, 'file');

              const { url: fileExternalUrl } = await cloudinaryClient.uploadImage(
                `data:image/jpeg;base64,${fileImage}`,
                {
                  folder: `${cloudinaryUploadFolder}/${title}_${page.id}/files`,
                  public_id: cloudinaryFilename,
                  overwrite: false, // Don't overwrite if already exists
                },
              );
              
              log.debug(`File '${fileTitle}' uploaded to Cloudinary: ${fileExternalUrl}`);
              
              updatedFiles.push({ name: fileTitle, url: fileExternalUrl });
              hasUpdates = true;
              
              log.info(`${page.id}: file '${fileTitle}' copied to Cloudinary ✅`);
            } catch (error) {
              log.error(`${page.id}: failed to process file '${fileInfo.name}': ${error instanceof Error ? error.message : 'Unknown error'}`);
              updatedFiles.push({ name: fileInfo.name, url: fileInfo.originalUrl }); // Keep original URL
            }
          }

          // Update the files property in Notion if there were any changes
          if (hasUpdates) {
            try {
              await notionClient.updateFilesPropertyExternalUrls(page.id, filesPropertyName, updatedFiles);
              log.info(`${page.id}: files property updated in Notion ✅`);
            } catch (error) {
              log.error(`${page.id}: failed to update files property in Notion: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch (error) {
        log.error(`${page.id}: failed to process files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      ////////////////////
      // icon
      ////////////////////
      try {
        const iconUrl = getImageUrlToUploadFromNotionImageDescriptor({
          image: 'icon' in page ? page.icon : undefined,
          uploadExternalsNotOnCloudinary,
        });


        if (!iconUrl) {
          log.debug(`${page.id}: icon image is already good ✔`);
        } else if (isCloudinaryUrl(iconUrl)) {
          log.debug(`${page.id}: icon image is already on Cloudinary ✔`);
        } else {
          log.info(`${page.id}: uploading icon image to Cloudinary`);

          let image;

          // check if the icon is a data url
          if (iconUrl.startsWith('data:image')) {
            image = iconUrl;
          } else {
            const iconImage = await downloadImageToBase64(iconUrl);
            if (!iconImage) {
              log.error(`${page.id}: failed to download icon image`);
              continue;
            }
            log.debug('Icon image downloaded');
            image = `data:image/jpeg;base64,${iconImage}`;
          }

          const cloudinaryFilename = generateCloudinaryFilename(iconUrl, title, 'icon');

          const { url: iconExternalUrl } = await cloudinaryClient.uploadImage(image, {
            folder: `${cloudinaryUploadFolder}/${title}_${page.id}/icons`,
            public_id: cloudinaryFilename,
            overwrite: false, // Don't overwrite if already exists
          });
          log.debug('Icon image uploaded to Cloudinary');

          await notionClient.updatePageIconExternalUrl(page.id, iconExternalUrl);
          log.info(`${page.id}: icon image copied to Cloudinary and asset updated in Notion ✅`);
        }
      } catch (error) {
        log.error(`${page.id}: failed to process icon: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      ////////////////////
      // image blocks
      ////////////////////
      try {
        log.debug(`${page.id}: fetching image blocks...`);
        const imageBlocks = await notionClient.fetchAllImageBlocks(page.id);
        log.debug(`Found ${imageBlocks.length} image blocks`);

        for (const imageBlock of imageBlocks) {
          try {
            if (!(BLOCK_TYPE_IMAGE in imageBlock)) {
              log.error(`${page.id}: ${imageBlock.id}: unexpected image block without value property`);
              continue;
            }

            const imageUrl = getImageUrlToUploadFromNotionImageDescriptor({
              image: imageBlock[BLOCK_TYPE_IMAGE],
              uploadExternalsNotOnCloudinary,
            });

            if (!imageUrl) {
              log.debug(`${page.id}: ${imageBlock.id}: block image already good ✔`);
              continue;
            } else if (isCloudinaryUrl(imageUrl)) {
              log.debug(`${page.id}: ${imageBlock.id}: block image is already on Cloudinary ✔`);
              continue;
            }
            log.info(`${page.id}: ${imageBlock.id}: uploading block image to Cloudinary`);

            const blockImage = await downloadImageToBase64(imageUrl);
            if (!blockImage) {
              log.error(`${page.id}: ${imageBlock.id}: failed to download block image`);
              continue;
            }
            log.debug('Block image downloaded');

            const filenameFromCaption = generateCloudinaryFilename(imageUrl, 
              imageBlock[BLOCK_TYPE_IMAGE].caption?.map(c => c.plain_text).join(''), 
              `block_${imageBlock.id.slice(0, 8)}`
            );

            const { url: imageExternalUrl } = await cloudinaryClient.uploadImage(
              `data:image/jpeg;base64,${blockImage}`,
              {
                folder: `${cloudinaryUploadFolder}/${title}_${page.id}/image-blocks`,
                public_id: filenameFromCaption,
                overwrite: false, // Don't overwrite if already exists
              },
            );
            log.debug('Block image uploaded to Cloudinary');

            await notionClient.updateImageBlockExternalUrl(imageBlock.id, imageExternalUrl);
            log.info(
              `${page.id}: ${imageBlock.id}: block image copied to Cloudinary and asset updated in Notion ✅`,
            );
          } catch (error) {
            log.error(`${page.id}: ${imageBlock.id}: failed to process block image: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        log.error(`${page.id}: failed to process image blocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      log.error(`${page.id}: failed to process page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  log.debug('Upload process completed');
}

async function uploadAllNotionImagesToCloudinary() {
  const databaseId = process.env.NOTION_DB_ID;
  if (!databaseId) {
    throw new Error('NOTION_DB_ID environment variable is required');
  }

  try {
    //console.log('Starting upload process...');
    //console.log('Database ID:', databaseId);
    //console.log('Cloudinary URL:', process.env.CLOUDINARY_URL ? 'SET' : 'NOT SET');
    //console.log('Cloudinary Upload Folder:', process.env.CLOUDINARY_UPLOAD_FOLDER || 'NOT SET');

    const notionClient = new NotionClient(process.env.NOTION_TOKEN || '', new Logger('debug'))
    const pageIds = await notionClient.getPageIdsFromDatabase(databaseId)
    
    //console.log(`Found ${pageIds.length} pages to process`);

    for (const pageId of pageIds) {
      try {
        //console.log(`Processing page ${pageId}...`);
        await uploadNotionImagesToCloudinary({
          notionToken: process.env.NOTION_TOKEN || '',
          notionPageId: pageId,
          cloudinaryUrl: process.env.CLOUDINARY_URL || '',
          cloudinaryUploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || '',
          logLevel: 'debug', // Force debug level for more visibility
          uploadExternalsNotOnCloudinary: true // Force upload of external images
        });
        //console.log(`Completed processing page ${pageId}`);
      } catch (error) {
        console.error(`Error processing page ${pageId}:`, error);
      }
    }
    //console.log('Upload process completed');
  } catch (error) {
    console.error('Upload process failed:', error);
    throw error;
  }
}

if (require.main === module) {
  uploadAllNotionImagesToCloudinary()
}