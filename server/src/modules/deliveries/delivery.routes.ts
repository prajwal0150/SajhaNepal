import { Router } from 'express';
import { authenticate, authorize } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';
import { DeliveryService } from './delivery.service';
import { uploadImages } from '../../core/middleware/upload';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';

const deliverySchema = z.object({
  reportId: z.string().min(1),
  organizationId: z.string().min(1),
  quantityDelivered: z.coerce.number().min(1, 'Delivered quantity must be at least 1'),
  recipientCount: z.coerce.number().int().min(0).optional().default(0),
  deliveryLocation: z
    .object({
      address: z.string().max(300).optional(),
      coordinates: z.array(z.coerce.number()).length(2).optional(),
      ward: z.coerce.number().int().min(1).max(35).optional(),
    })
    .optional(),
  notes: z.string().max(2000).optional().default(''),
});

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('NGO'),
  uploadImages.array('proofImages', 5),
  validateBody(deliverySchema),
  asyncHandler(async (req, res) => {
    const files = (req.files ?? []) as Express.Multer.File[];
    const result = await DeliveryService.createDelivery(req.body, files, req);
    sendSuccess(res, result, 'Delivery recorded successfully', 201);
  }),
);

router.get('/mine', authenticate, authorize('NGO'), asyncHandler(async (req, res) => {
  const items = await DeliveryService.getMyDeliveries(req);
  sendSuccess(res, items, 'My deliveries fetched');
}));

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const items = await DeliveryService.getDeliveriesForReport(String(req.query.reportId));
  sendSuccess(res, items, 'Deliveries fetched');
}));

export default router;
