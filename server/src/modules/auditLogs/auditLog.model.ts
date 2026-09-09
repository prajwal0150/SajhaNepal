import mongoose, { Schema } from 'mongoose';

const auditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
