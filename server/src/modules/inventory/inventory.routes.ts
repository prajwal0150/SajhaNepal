import { Router } from 'express';
import { InventoryItem, InventoryTransaction, ITEM_TYPES, TRANSACTION_TYPES } from './inventory.model';
import { ReliefSite } from '../reliefSites/reliefSite.model';
import { authenticate, authorize } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';
import { z } from 'zod';import { validateBody } from '../../core/middleware/validate';
import { NotFoundError, BadRequestError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';
import { emitEvent } from '../../sockets';

const itemSchema = z.object({
  warehouse: z.string().min(1),
  itemType: z.enum(ITEM_TYPES),
  quantity: z.coerce.number().min(0).default(0),
  unit: z.string().max(30).default('units'),
  lowStockThreshold: z.coerce.number().min(0).default(10),
});

const transactionSchema = z.object({
  item: z.string().min(1),
  transactionType: z.enum(TRANSACTION_TYPES),
  quantityChanged: z.coerce.number().refine((v) => v !== 0, 'Quantity cannot be zero'),
  relatedReport: z.string().optional(),
  notes: z.string().max(500).optional().default(''),
});

const router = Router();

router.get('/items', authenticate, authorize('NGO', 'GOVERNMENT', 'ADMIN'), asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.query.warehouse) filter.warehouse = req.query.warehouse;
  if (req.query.itemType) filter.itemType = req.query.itemType;
  const items = await InventoryItem.find(filter)
    .populate('warehouse', 'name district municipality')
    .sort({ createdAt: -1 });
  sendSuccess(res, items.map((i) => i.toJSON()), 'Inventory items fetched');
}));

router.post('/items', authenticate, authorize('NGO', 'ADMIN'), validateBody(itemSchema), asyncHandler(async (req, res) => {
  const warehouse = await ReliefSite.findById(req.body.warehouse);
  if (!warehouse || warehouse.siteType !== 'WAREHOUSE') {
    throw new BadRequestError('A valid warehouse (relief site of type WAREHOUSE) is required');
  }
  const existing = await InventoryItem.findOne({ warehouse: req.body.warehouse, itemType: req.body.itemType });
  if (existing) throw new BadRequestError(`Item ${req.body.itemType} already exists in this warehouse`);

  const item = await InventoryItem.create(req.body);
  await logAudit({ req, action: 'INVENTORY_ITEM_CREATED', entityType: 'InventoryItem', entityId: String(item._id), metadata: { quantity: req.body.quantity } });
  emitEvent('inventory:updated', item.toJSON());
  sendSuccess(res, item.toJSON(), 'Inventory item created', 201);
}));

/**
 * Record inventory transaction with ATOMIC stock update.
 * OUT uses a guarded findOneAndUpdate so stock can never go negative.
 */
router.post('/transactions', authenticate, authorize('NGO', 'GOVERNMENT', 'ADMIN'), validateBody(transactionSchema), asyncHandler(async (req, res) => {
  const item = await InventoryItem.findById(req.body.item);
  if (!item) throw new NotFoundError('Inventory item not found');

  const { transactionType, quantityChanged } = req.body;

  if (transactionType === 'OUT') {
    const updated = await InventoryItem.findOneAndUpdate(
      { _id: item._id, quantity: { $gte: quantityChanged } },
      { $inc: { quantity: -quantityChanged } },
      { new: true },
    );
    if (!updated) {
      throw new BadRequestError(`Insufficient stock: only ${item.quantity} ${item.unit} available`);
    }
    item.quantity = updated.quantity;
  } else {
    const delta = transactionType === 'IN' ? Math.abs(quantityChanged) : quantityChanged; // ADJUSTMENT can be negative
    if (transactionType === 'ADJUSTMENT' && item.quantity + delta < 0) {
      throw new BadRequestError('Adjustment would make stock negative');
    }
    const updated = await InventoryItem.findByIdAndUpdate(
      item._id,
      { $inc: { quantity: delta } },
      { new: true },
    );
    item.quantity = updated!.quantity;
  }

  const transaction = await InventoryTransaction.create({
    item: item._id,
    warehouse: item.warehouse,
    transactionType,
    quantityChanged,
    performedBy: req.user?.id,
    relatedReport: req.body.relatedReport || null,
    notes: req.body.notes,
  });

  await logAudit({ req, action: 'INVENTORY_TRANSACTION', entityType: 'InventoryItem', entityId: String(item._id), metadata: { transactionType, quantityChanged } });
  emitEvent('inventory:updated', item.toJSON());
  sendSuccess(res, { item: item.toJSON(), transaction: transaction.toJSON() }, 'Transaction recorded', 201);
}));

router.get('/transactions', authenticate, authorize('NGO', 'GOVERNMENT', 'ADMIN'), asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.query.warehouse) filter.warehouse = req.query.warehouse;
  if (req.query.item) filter.item = req.query.item;
  const items = await InventoryTransaction.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('performedBy', 'fullName')
    .populate('item', 'itemType unit');
  sendSuccess(res, items.map((t) => t.toJSON()), 'Inventory transactions fetched');
}));

export default router;
