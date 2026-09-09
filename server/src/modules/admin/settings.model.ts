import mongoose, { Schema } from 'mongoose';

const settingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: 'platform' },
    maintenanceMode: { type: Boolean, default: false },
    defaultRequireProof: { type: Boolean, default: true },
    reportRetentionDays: { type: Number, default: 365 },
    allowSelfRegistration: { type: Boolean, default: true },
    emergencyMessage: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false },
);

export const Settings = mongoose.model('Settings', settingsSchema);
