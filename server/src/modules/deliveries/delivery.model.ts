import mongoose, { Schema } from 'mongoose';

const deliverySchema = new Schema(
  {
    report: { type: Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    deliveredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantityDelivered: { type: Number, required: true, min: 1 },
    recipientCount: { type: Number, min: 0, default: 0 },
    deliveryLocation: {
      address: { type: String },
      coordinates: { type: [Number] },
      ward: { type: Number },
    },
    proofImages: { type: [String], default: [] },
    notes: { type: String, maxlength: 2000 },
    deliveredAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

deliverySchema.index({ organization: 1, deliveredAt: -1 });

export const Delivery = mongoose.model('Delivery', deliverySchema);
