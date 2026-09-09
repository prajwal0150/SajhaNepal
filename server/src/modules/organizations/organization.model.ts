import mongoose, { Schema } from 'mongoose';
import { ORG_TYPES, ORG_VERIFICATION_STATUSES } from './organization.types';

const organizationSchema = new Schema(
  {
    name: { type: String, required: [true, 'Organization name is required'], trim: true, index: true },
    type: { type: String, enum: ORG_TYPES, default: 'NGO' },
    description: { type: String, maxlength: 2000 },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    logo: { type: String },
    registrationNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    province: { type: String, trim: true, index: true },
    district: { type: String, trim: true, index: true },
    municipality: { type: String, trim: true },
    ward: { type: Number },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [84.124, 28.3949] }, // [lng, lat] Nepal centroid
    },
    verificationStatus: { type: String, enum: ORG_VERIFICATION_STATUSES, default: 'PENDING', index: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        roleInOrg: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

organizationSchema.index({ location: '2dsphere' });

export const Organization = mongoose.model('Organization', organizationSchema);
