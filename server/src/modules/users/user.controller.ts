import { Request, Response } from 'express';
import { User } from './user.model';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta, escapeRegex } from '../../core/utils/helpers';
import { NotFoundError, ForbiddenError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';
import { emitEvent } from '../../sockets';

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(String(req.query.search)), 'i');
    filter.$or = [{ fullName: rx }, { email: rx }, { phone: rx }];
  }
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isBlocked) filter.isBlocked = req.query.isBlocked === 'true';

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((u) => u.toJSON()), 'Users fetched', 200, buildPaginationMeta(total, page, limit));
});

export const listVolunteers = asyncHandler(async (_req: Request, res: Response) => {
  const items = await User.find({ role: 'VOLUNTEER', isActive: true, isBlocked: false })
    .select('fullName avatar district isVerified')
    .limit(200);
  sendSuccess(res, items.map((u) => u.toJSON()), 'Volunteers fetched');
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User not found');

  const { role, isActive, isBlocked } = req.body as { role?: string; isActive?: boolean; isBlocked?: boolean };
  if (role !== undefined) user.role = role as never;
  if (isActive !== undefined) user.isActive = isActive;
  if (isBlocked !== undefined) user.isBlocked = isBlocked;
  await user.save();

  await logAudit({
    req,
    action: 'USER_UPDATED',
    entityType: 'User',
    entityId: String(user._id),
    metadata: { role, isActive, isBlocked },
  });
  emitEvent('report:updated', { scope: 'users' }); // general signal
  sendSuccess(res, user.toJSON(), 'User updated');
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  const isSelf = req.user?.id === String(user._id);
  const isStaff = ['ADMIN', 'GOVERNMENT'].includes(req.user?.role ?? '');
  if (!isSelf && !isStaff) throw new ForbiddenError('You can only view your own profile');
  sendSuccess(res, user.toJSON(), 'User fetched');
});
