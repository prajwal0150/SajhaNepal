import { Notification, NotificationType } from './notification.model';
import { emitEvent } from '../../sockets';

export interface CreateNotificationInput {
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  entity?: { kind: string; id?: string };
}

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  if (!input.userId) return;
  const notification = await Notification.create({
    user: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    entity: input.entity ?? undefined,
  });
  emitEvent('notification:new', notification.toJSON(), `user:${input.userId}`);
}

export async function notifyUsers(userIds: (string | null | undefined)[], input: Omit<CreateNotificationInput, 'userId'>): Promise<void> {
  await Promise.all(
    Array.from(new Set(userIds.filter((u): u is string => Boolean(u)))).map((userId) =>
      createNotification({ ...input, userId }),
    ),
  );
}

export async function notifyRole(role: string, input: Omit<CreateNotificationInput, 'userId'>): Promise<void> {
  const { User } = await import('../users/user.model');
  const users = await User.find({ role, isActive: true, isBlocked: false }).select('_id').lean();
  await Promise.all(users.map((u) => createNotification({ ...input, userId: String(u._id) })));
}
