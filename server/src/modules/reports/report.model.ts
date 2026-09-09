import mongoose, { Schema } from 'mongoose';
import {
  NEED_TYPES,
  REPORT_STATUSES,
  URGENCY_LEVELS,
  VERIFICATION_STATUSES,
  REPORT_SOURCES,
} from './report.types';

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    reporterContact: { type: String, trim: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 3000 },
    needType: { type: String, enum: NEED_TYPES, required: true, index: true },
    urgency: { type: String, enum: URGENCY_LEVELS, required: true, index: true },
    status: { type: String, enum: REPORT_STATUSES, default: 'PENDING', index: true },
    verificationStatus: { type: String, enum: VERIFICATION_STATUSES, default: 'PENDING', index: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    province: { type: String, trim: true, index: true },
    district: { type: String, trim: true, index: true },
    municipality: { type: String, trim: true, index: true },
    ward: { type: Number, min: 1, max: 35, index: true },
    address: { type: String, trim: true },
    affectedPeople: { type: Number, min: 0, default: 1 },
    requiredQuantity: { type: Number, min: 0, default: 1 },
    quantityUnit: { type: String, default: 'units', trim: true },
    deliveredQuantity: { type: Number, min: 0, default: 0 },
    images: { type: [String], default: [] },
    voiceUrl: { type: String },
    transcription: { type: String, default: null },
    source: { type: String, enum: REPORT_SOURCES, default: 'WEB' },
    verificationScore: { type: Number, default: 0, min: 0, max: 100 },
    duplicateScore: { type: Number, default: 0, min: 0, max: 100 },
    fraudScore: { type: Number, default: 0, min: 0, max: 100 },
    flags: { type: [String], default: [] },
    requireProof: { type: Boolean, default: true },
    consent: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    claimedBy: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
    claimedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1, urgency: 1, createdAt: -1 });
reportSchema.index({ title: 'text', description: 'text' });

export const Report = mongoose.model('Report', reportSchema);
