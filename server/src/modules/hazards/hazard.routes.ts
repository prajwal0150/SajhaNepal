import { Router } from 'express';
import { Hazard } from './hazard.model';
import { authenticate, authorize, optionalAuthenticate } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta } from '../../core/utils/helpers';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';
import { NotFoundError } from '../../core/errors/appError';
import { HAZARD_TYPES } from './hazard.model';

const hazardSchema = z.object({
  type: z.enum(HAZARD_TYPES),
  title: z.string().min(3).max(150),
  description: z.string().max(3000).optional().default(''),
  severity: z.enum(['LOW', 'MODERATE', 'HIGH', 'EXTREME']).default('MODERATE'),
  source: z.string().max(60).optional().default('MANUAL'),
  location: z.string().max(200).optional().default(''),
  province: z.string().max(60).optional().default(''),
  district: z.string().max(60).optional().default(''),
  affectedArea: z.array(z.string().max(100)).optional().default([]),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

const router = Router();

router.get('/', optionalAuthenticate, asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  else if (!req.user || !['ADMIN', 'GOVERNMENT'].includes(req.user.role)) filter.status = 'ACTIVE';
  if (req.query.type) filter.type = req.query.type;
  if (req.query.district) filter.district = req.query.district;

  const [items, total] = await Promise.all([
    Hazard.find(filter).sort({ startTime: -1 }).skip(skip).limit(limit),
    Hazard.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((h) => h.toJSON()), 'Hazard alerts fetched', 200, buildPaginationMeta(total, page, limit));
}));

router.post('/', authenticate, authorize('ADMIN', 'GOVERNMENT'), validateBody(hazardSchema), asyncHandler(async (req, res) => {
  const hazard = await Hazard.create(req.body);
  sendSuccess(res, hazard.toJSON(), 'Hazard alert created', 201);
}));

router.patch('/:id', authenticate, authorize('ADMIN', 'GOVERNMENT'), validateBody(hazardSchema.partial()), asyncHandler(async (req, res) => {
  const hazard = await Hazard.findById(req.params.id);
  if (!hazard) throw new NotFoundError('Hazard alert not found');
  Object.assign(hazard, req.body);
  await hazard.save();
  sendSuccess(res, hazard.toJSON(), 'Hazard alert updated');
}));

export default router;
