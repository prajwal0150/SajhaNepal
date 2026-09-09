import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../auth/jwt';
import { UnauthorizedError, ForbiddenError, AppError } from '../errors/appError';
import { UserRole } from '../../modules/users/user.types';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication required'));
  }
  const token = header.slice(7).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new UnauthorizedError());
  }
}

/**
 * Role authorization middleware factory.
 * Backend-enforced RBAC — frontend route guards are convenience only.
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError('Authentication required'));
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = verifyAccessToken(header.slice(7).trim());
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // ignore — optional auth
    }
  }
  next();
}
