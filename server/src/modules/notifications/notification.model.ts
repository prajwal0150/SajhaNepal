import mongoose, { Schema } from 'mongoose';

export const NOTIFICATION_TYPES = [
  'REPORT_CREATED',
  'REPORT_VERIFIED',
  'REPORT_REJECTED',
  'REPORT_CLAIMED',
  'DELIVERY_SUBMITTED',
  'REPORT_RESOLVED',
  'NEW_CRITICAL_NEED',
  'ORGANIZATION_APPROVED',
  'SYSTEM_ALERT',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    entity: {
      kind: { type: String, enum: ['report', 'organization', 'missing_person', 'system'] },
      id: { type: Schema.Types.ObjectId },
    },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
