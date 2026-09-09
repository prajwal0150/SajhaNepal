import { Request, NextFunction } from 'express';
import { env } from '../../config/environment';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UnauthorizedError } from '../errors/appError';

export interface JwtPayload {
  sub: string;
  role: string;
  type: 'access' | 'refresh';
  jti?: string;
}

export function signAccessToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role, type: 'access', jti: crypto.randomUUID() }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

export function signRefreshToken(userId: string, role: string): string {
  // jti guarantees every rotation produces a unique token string
  return jwt.sign({ sub: userId, role, type: 'refresh', jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    if (payload.type !== 'access') throw new Error('wrong token type');
    return payload;
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    if (payload.type !== 'refresh') throw new Error('wrong token type');
    return payload;
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export type AuthenticatedRequest = Request & { user: { id: string; role: string } };
export type NextFn = NextFunction;
