import mongoose, { Schema } from 'mongoose';

export const SITE_TYPES = ['SHELTER', 'WAREHOUSE'] as const;
export type SiteType = (typeof SITE_TYPES)[number];

export const SITE_STATUSES = ['ACTIVE', 'FULL', 'CLOSED'] as const;
export type SiteStatus = (typeof SITE_STATUSES)[number];

const reliefSiteSchema = new Schema(
  {
    name: { type: String, required: [true, 'Site name is required'], trim: true },
    siteType: { type: String, enum: SITE_TYPES, required: true, index: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    province: { type: String, trim: true, index: true },
    district: { type: String, trim: true, index: true },
    municipality: { type: String, trim: true },
    ward: { type: Number },
    address: { type: String, trim: true },
    capacity: { type: Number, required: true, min: 0 },
    currentOccupancy: { type: Number, default: 0, min: 0 },
    contact: { type: String, trim: true },
    managedBy: { type: Schema.Types.ObjectId, ref: 'Organization' },
    status: { type: String, enum: SITE_STATUSES, default: 'ACTIVE', index: true },
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true, versionKey: false },
);

reliefSiteSchema.index({ location: '2dsphere' });

export const ReliefSite = mongoose.model('ReliefSite', reliefSiteSchema);
