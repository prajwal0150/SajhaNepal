import { v2 as cloudinary } from 'cloudinary';
import { env, isDev } from '../../config/environment';

/**
 * Cloudinary integration adapter.
 * When credentials are configured, uploads go to Cloudinary.
 * In development without credentials, files fall back to local disk storage
 * served at /uploads — clearly a development mode, never faked as cloud upload.
 */
export const cloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId: string | null;
  provider: 'cloudinary' | 'local-dev';
}

export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  folder: string,
): Promise<UploadResult> {
  if (cloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `saajha-rahat/${folder}`, resource_type: 'auto', filename_override: filename },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id, provider: 'cloudinary' });
        },
      );
      stream.end(buffer);
    });
  }
  // Development fallback: local disk storage
  const { writeFile, mkdir } = await import('fs/promises');
  const path = await import('path');
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const dir = path.join(process.cwd(), 'uploads', folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), buffer);
  const url = `/uploads/${folder}/${safeName}`;
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(`[upload:dev-local] stored ${url} (Cloudinary not configured)`);
  }
  return { url, publicId: null, provider: 'local-dev' };
}
