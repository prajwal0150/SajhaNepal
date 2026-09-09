import multer from 'multer';
import { BadRequestError } from '../errors/appError';

const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_MIME = ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/aac'];

const storage = multer.memoryStorage();

const fileFilter =
  (accept: string[]) =>
  (_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    if (accept.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError(`Invalid file type: ${file.mimetype}. Allowed: ${accept.join(', ')}`));
    }
  };

export const uploadImages = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: fileFilter(ALLOWED_IMAGE_MIME),
});

export const uploadMedia = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 6 },
  fileFilter: fileFilter([...ALLOWED_IMAGE_MIME, ...ALLOWED_AUDIO_MIME]),
});

export { ALLOWED_IMAGE_MIME, ALLOWED_AUDIO_MIME };
