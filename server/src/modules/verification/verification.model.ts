import mongoose, { Schema } from 'mongoose';
import { VERIFICATION_DECISIONS } from '../reports/report.types';

const verificationSchema = new Schema(
  {
    report: { type: Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
    volunteer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    decision: { type: String, enum: VERIFICATION_DECISIONS, required: true },
    notes: { type: String, maxlength: 2000 },
    evidence: { type: [String], default: [] },
    urgencyOverride: { type: String },
  },
  { timestamps: true, versionKey: false },
);

verificationSchema.index({ volunteer: 1, createdAt: -1 });

export const Verification = mongoose.model('Verification', verificationSchema);
