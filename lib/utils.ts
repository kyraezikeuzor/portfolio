import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NotionDatabaseProperties } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toPathFromText(text: string) {
  let finalString = '/' + text.toLowerCase().replaceAll(' ', '-');
  return finalString;
}

export function formatTimespanFromDate(startDate: string, endDate: string) {
  // Handle missing dates
  if (!startDate && !endDate) {
    return 'Present';
  }

  if (!startDate) {
    return 'Present';
  }

  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    year: 'numeric',
  });

  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    year: 'numeric',
  });

  // If endDate doesn't exist, it means the timespan is ongoing
  if (!endDate) {
    return `${formattedStartDate}-Present`;
  }

  // If both dates are the same, just return a single year
  if (formattedStartDate === formattedEndDate) {
    return formattedStartDate;
  }

  return `${formattedStartDate}-${formattedEndDate}`;
}

export function formatYearFromDate(date: string) {
  var formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
  });

  if (!date) {
    return ``;
  }

  return `${formattedDate}`;
}

export function extractSiteNameFromUrl(url: string) {
  if (url) {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  }
  return '';
}

/**
 * Turns a caption in a Notion image block into a filename
 * This is done for SEO, so the images can be discoverable more easily
 *
 * https://cloudinary.com/documentation/image_upload_api_reference
 * public_id:
 *   Can be up to 255 characters, including non-English characters, periods (.),
 *   forward slashes (/), underscores (_), hyphens (-).
 *   Public ID values cannot begin or end with a space or forward slash (/).
 *   Additionally, they cannot include the following characters: ? & # \ % < > +
 */

export function makeFilename(
  caption: string | Record<'plain_text', string>[],
  maxLength = 50
): string | undefined {
  maxLength = maxLength > 255 ? 255 : maxLength;

  const plainText =
    typeof caption === 'string'
      ? caption
      : caption.map((content) => content.plain_text).join('');
  const normalizedCaption = plainText
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const filename = normalizedCaption
    .replace(/[^0-9a-z_-]/gi, '_')
    .toLowerCase()
    // max characters
    .substring(0, maxLength)
    // remove trailing underscores
    .replace(/_+$/, '')
    // remove multiple underscores
    .replace(/_{2,}/g, '_');

  return filename;
}

export function isImageFile(fileUrl: string): boolean {
  if (fileUrl) {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl);
  }
  return false;
}

import https from 'https';

export default function downloadImageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (response) => {
      const chunks: unknown[] = [];

      response.on('data', function (chunk) {
        chunks.push(chunk);
      });

      response.on('end', function () {
        const result = Buffer.concat(chunks as ReadonlyArray<Uint8Array>);
        resolve(result.toString('base64'));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

export function generateCloudinaryFilename(
  url: string,
  title?: string,
  suffix?: string
): string {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 8);
  const base = title ? makeFilename(title, 150) : 'image';
  return suffix ? `${base}_${suffix}_${hash}` : `${base}_${hash}`;
}

import { NotionImageOptions } from '@/types';

export function getImageUrlToUploadFromNotionImageDescriptor({
  image,
  uploadExternalsNotOnCloudinary,
}: {
  image: NotionImageOptions;
  uploadExternalsNotOnCloudinary: boolean;
}) {
  if (!image) {
    return undefined;
  }
  // hosted in Notion, then we want to copy it to Cloudinary
  if (image.type === 'file') {
    return image.file.url;
  }
  // Hosted externally, but we still want to upload it to Cloudinary
  if (
    uploadExternalsNotOnCloudinary &&
    image.type === 'external' &&
    !image.external.url.includes('cloudinary')
  ) {
    return image.external.url;
  }
  return undefined;
}

export function processFileUrls(
  files: Array<{ name: string; url: string }>
): Array<{ name: string; url: string; isCloudinary: boolean }> {
  return files.map((file) => ({
    name: file.name,
    url: file.url,
    isCloudinary:
      file.url.includes('cloudinary.com') ||
      file.url.includes('res.cloudinary.com'),
  }));
}