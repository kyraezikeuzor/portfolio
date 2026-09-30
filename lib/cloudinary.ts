import { v2 as cloudinary } from 'cloudinary';

export async function config({ cloudinaryUrl }: { cloudinaryUrl: string }) {
  const urlRegex =
    /^cloudinary:\/\/([a-z0-9-_]+):([a-z0-9-_]+)@([a-z0-9-_]+)$/i;
  if (!urlRegex.test(cloudinaryUrl)) {
    throw new Error(
      `Invalid Cloudinary URL provided. It should match ${urlRegex.toString()}`
    );
  }
  const [, apiKey, apiSecret, cloudName] = cloudinaryUrl.match(urlRegex) || [];
  cloudinary.config({
    secure: true,
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
  });
}

// Throws on failure. Callers write the returned URL back into Notion, so
// resolving with an empty string here would overwrite the original asset URL.
export async function uploadImage(
  image: string,
  options = {}
): Promise<{ url: string }> {
  const result = await cloudinary.uploader.upload(image, options);

  if (!result.secure_url) {
    throw new Error('Cloudinary upload returned no secure_url');
  }

  return { url: result.secure_url };
}
