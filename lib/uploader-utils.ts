import { createHash } from 'crypto';
import https from 'https';
import { NotionImageOptions } from '@/types';

function makeFilename(
  caption: string | Record<'plain_text', string>[],
  maxLength = 50
) {
  const plainText =
    typeof caption === 'string'
      ? caption
      : caption.map((content) => content.plain_text).join('');

  return plainText
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^0-9a-z_-]/gi, '_')
    .toLowerCase()
    .slice(0, Math.min(maxLength, 255))
    .replace(/_+$/, '')
    .replace(/_{2,}/g, '_');
}

export function downloadImageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.request(url, (response) => {
      const chunks: Uint8Array[] = [];

      response.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      response.on('end', () => {
        resolve(Buffer.concat(chunks).toString('base64'));
      });
    });

    request.on('error', reject);
    request.end();
  });
}

export function generateCloudinaryFilename(
  url: string,
  title?: string,
  suffix?: string
) {
  const hash = createHash('md5').update(url).digest('hex').slice(0, 8);
  const base = title ? makeFilename(title, 150) : 'image';

  return suffix ? `${base}_${suffix}_${hash}` : `${base}_${hash}`;
}

export function getImageUrlToUploadFromNotionImageDescriptor({
  image,
  uploadExternalsNotOnCloudinary,
}: {
  image: NotionImageOptions;
  uploadExternalsNotOnCloudinary: boolean;
}) {
  if (!image) return undefined;
  if (image.type === 'file') return image.file.url;

  if (
    uploadExternalsNotOnCloudinary &&
    image.type === 'external' &&
    !image.external.url.includes('cloudinary')
  ) {
    return image.external.url;
  }

  return undefined;
}
