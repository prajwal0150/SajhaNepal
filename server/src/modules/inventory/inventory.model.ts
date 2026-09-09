import mongoose, { Schema } from 'mongoose';

export const ITEM_TYPES = ['WATER', 'FOOD', 'MEDICINE', 'TARPAULIN', 'BLANKET', 'CLOTHING', 'OTHER'] as const;
export type InventoryItemType = (typeof ITEM_TYPES)[number];

export const TRANSACTION_TYPES = ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

const inventoryItemSchema = new Schema(
  {
    warehouse: { type: Schema.Types.ObjectId, ref: 'ReliefSite', required: true, index: true },
    itemType: { type: String, enum: ITEM_TYPES, required: true },
    quantity: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'units' },
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true, versionKey: false },
);

inventoryItemSchema.index({ warehouse: 1, itemType: 1 }, { unique: true });

const inventoryTransactionSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true, index: true },
    warehouse: { type: Schema.Types.ObjectId, ref: 'ReliefSite', required: true },
    transactionType: { type: String, enum: TRANSACTION_TYPES, required: true },
    quantityChanged: { type: Number, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedReport: { type: Schema.Types.ObjectId, ref: 'Report', default: null },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true, versionKey: false },
);

inventoryTransactionSchema.index({ createdAt: -1 });

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
