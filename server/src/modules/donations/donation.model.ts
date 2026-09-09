import mongoose, { Schema } from 'mongoose';

export const DONATION_STATUSES = ['RECEIVED', 'ALLOCATED', 'DISBURSED', 'COMPLETED', 'CANCELLED'] as const;
export type DonationStatus = (typeof DONATION_STATUSES)[number];

const donationSchema = new Schema(
  {
    donorReference: { type: String, trim: true },
    donorName: { type: String, trim: true },
    amountNPR: { type: Number, required: true, min: 1 },
    linkedReport: { type: Schema.Types.ObjectId, ref: 'Report', default: null },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    disbursedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    proofImage: { type: String },
    notes: { type: String, maxlength: 1000 },
    status: { type: String, enum: DONATION_STATUSES, default: 'RECEIVED', index: true },
  },
  { timestamps: true, versionKey: false },
);

export const Donation = mongoose.model('Donation', donationSchema);
