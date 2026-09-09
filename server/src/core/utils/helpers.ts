import { Request, Response } from 'express';
import { Types } from 'mongoose';

export function sendSuccess(
  res: Response,
  data: unknown,
  message = 'Success',
  status = 200,
  meta?: object,
): Response {
  return res.status(status).json({ success: true, message, data, meta });
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function getPagination(req: Request): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

export function toObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new Types.ObjectId(id);
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
