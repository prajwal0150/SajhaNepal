import mongoose, { Schema } from 'mongoose';

export const MP_STATUSES = ['SEARCHING', 'FOUND_SAFE', 'FOUND_DECEASED', 'CLOSED'] as const;
export type MissingPersonStatus = (typeof MP_STATUSES)[number];

const missingPersonSchema = new Schema(
  {
    fullName: { type: String, required: [true, 'Name is required'], trim: true, index: true },
    photo: { type: String },
    age: { type: Number, min: 0, max: 130 },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'], default: 'UNKNOWN' },
    lastSeenLocation: { type: String, required: true, trim: true },
    lastSeenWard: { type: Number },
    district: { type: String, trim: true, index: true },
    description: { type: String, maxlength: 2000 },
    contactPhone: { type: String, trim: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: MP_STATUSES, default: 'SEARCHING', index: true },
    matchedShelter: { type: Schema.Types.ObjectId, ref: 'ReliefSite', default: null },
  },
  { timestamps: true, versionKey: false },
);

export const MissingPerson = mongoose.model('MissingPerson', missingPersonSchema);
