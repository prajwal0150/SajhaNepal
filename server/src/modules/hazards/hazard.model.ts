import mongoose, { Schema } from 'mongoose';

export const HAZARD_TYPES = ['FLOOD', 'LANDSLIDE', 'EARTHQUAKE', 'WEATHER', 'OTHER'] as const;
export type HazardType = (typeof HAZARD_TYPES)[number];

export const HAZARD_SEVERITIES = ['LOW', 'MODERATE', 'HIGH', 'EXTREME'] as const;
export type HazardSeverity = (typeof HAZARD_SEVERITIES)[number];

export const HAZARD_STATUSES = ['ACTIVE', 'EXPIRED', 'CANCELLED'] as const;
export type HazardStatus = (typeof HAZARD_STATUSES)[number];

const hazardSchema = new Schema(
  {
    type: { type: String, enum: HAZARD_TYPES, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 3000 },
    severity: { type: String, enum: HAZARD_SEVERITIES, default: 'MODERATE', index: true },
    source: { type: String, default: 'MANUAL' },
    location: { type: String, trim: true },
    province: { type: String, trim: true, index: true },
    district: { type: String, trim: true, index: true },
    affectedArea: { type: [String], default: [] },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    status: { type: String, enum: HAZARD_STATUSES, default: 'ACTIVE', index: true },
    isMock: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const Hazard = mongoose.model('Hazard', hazardSchema);
