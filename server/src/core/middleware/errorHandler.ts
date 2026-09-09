import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../errors/appError';
import { env } from '../../config/environment';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    res.status(422).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
    return;
  }

  // Multer errors
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const multerError = err as { code: string; message?: string };
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ success: false, message: 'File too large (max 10MB)' });
      return;
    }
    if (multerError.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({ success: false, message: 'Unexpected file field' });
      return;
    }
  }

  // eslint-disable-next-line no-console
  console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : String((err as Error)?.message ?? err),
  });
}
