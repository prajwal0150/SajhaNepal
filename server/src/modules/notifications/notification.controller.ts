import { Request, Response } from 'express';
import { Notification } from './notification.model';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta } from '../../core/utils/helpers';
import { NotFoundError, ForbiddenError } from '../../core/errors/appError';

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const filter = { user: req.user?.id };
  const [items, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((n) => n.toJSON()), 'Notifications fetched', 200, buildPaginationMeta(total, page, limit));
});

export const unreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await Notification.countDocuments({ user: req.user?.id, isRead: false });
  sendSuccess(res, { count }, 'Unread count');
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new NotFoundError('Notification not found');
  if (String(notification.user) !== req.user?.id) throw new ForbiddenError('Not your notification');
  notification.isRead = true;
  await notification.save();
  sendSuccess(res, notification.toJSON(), 'Marked as read');
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany({ user: req.user?.id, isRead: false }, { isRead: true });
  sendSuccess(res, null, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new NotFoundError('Notification not found');
  if (String(notification.user) !== req.user?.id) throw new ForbiddenError('Not your notification');
  await notification.deleteOne();
  sendSuccess(res, null, 'Notification deleted');
});
