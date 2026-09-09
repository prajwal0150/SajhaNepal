import { Router, Request } from 'express';
import { ReliefSite } from './reliefSite.model';
import { authenticate, authorize, optionalAuthenticate } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta, escapeRegex } from '../../core/utils/helpers';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';
import { NotFoundError, BadRequestError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';
import { emitEvent } from '../../sockets';

const siteSchema = z.object({
  name: z.string().min(2).max(150),
  siteType: z.enum(['SHELTER', 'WAREHOUSE']),
  longitude: z.coerce.number().min(79.5).max(88.5),
  latitude: z.coerce.number().min(26).max(30.8),
  province: z.string().max(60).optional().default(''),
  district: z.string().max(60).optional().default(''),
  municipality: z.string().max(80).optional().default(''),
  ward: z.coerce.number().int().min(1).max(35).optional(),
  address: z.string().max(300).optional().default(''),
  capacity: z.coerce.number().min(0),
  currentOccupancy: z.coerce.number().min(0).optional().default(0),
  contact: z.string().max(30).optional().default(''),
  managedBy: z.string().optional(),
  notes: z.string().max(1000).optional().default(''),
});

const occupancySchema = z.object({
  currentOccupancy: z.coerce.number().min(0),
});

const router = Router();

router.get('/', optionalAuthenticate, asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (req.query.siteType) filter.siteType = req.query.siteType;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.district) filter.district = new RegExp(escapeRegex(String(req.query.district)), 'i');
  if (req.query.search) {
    filter.name = new RegExp(escapeRegex(String(req.query.search)), 'i');
  }

  const [items, total] = await Promise.all([
    ReliefSite.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('managedBy', 'name type'),
    ReliefSite.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((s) => s.toJSON()), 'Relief sites fetched', 200, buildPaginationMeta(total, page, limit));
}));

router.post('/', authenticate, authorize('ADMIN', 'GOVERNMENT', 'NGO'), validateBody(siteSchema), asyncHandler(async (req: Request, res) => {
  const body = req.body as Record<string, unknown>;
  const occupancy = Number(body.currentOccupancy ?? 0);
  const capacity = Number(body.capacity);
  if (occupancy > capacity) {
    throw new BadRequestError('Current occupancy cannot exceed capacity');
  }
  const site = await ReliefSite.create({
    ...body,
    location: { type: 'Point', coordinates: [body.longitude, body.latitude] },
    status: occupancy >= capacity ? 'FULL' : 'ACTIVE',
  });
  await logAudit({ req, action: 'RELIEF_SITE_CREATED', entityType: 'ReliefSite', entityId: String(site._id) });
  emitEvent('shelter:updated', site.toJSON());
  sendSuccess(res, site.toJSON(), 'Relief site created', 201);
}));

router.patch('/:id', authenticate, authorize('ADMIN', 'GOVERNMENT', 'NGO'), validateBody(siteSchema.partial().omit({ longitude: true, latitude: true })), asyncHandler(async (req, res) => {
  const site = await ReliefSite.findById(req.params.id);
  if (!site) throw new NotFoundError('Relief site not found');
  const allowed = ['name', 'siteType', 'province', 'district', 'municipality', 'ward', 'address', 'capacity', 'contact', 'managedBy', 'notes', 'status'];
  for (const key of allowed) if (req.body[key] !== undefined) (site as unknown as Record<string, unknown>)[key] = req.body[key];
  if (site.currentOccupancy > site.capacity) throw new BadRequestError('Current occupancy cannot exceed capacity');
  if (site.currentOccupancy >= site.capacity && site.status === 'ACTIVE') site.status = 'FULL';
  await site.save();
  emitEvent('shelter:updated', site.toJSON());
  sendSuccess(res, site.toJSON(), 'Relief site updated');
}));

router.patch('/:id/occupancy', authenticate, authorize('ADMIN', 'GOVERNMENT', 'NGO'), validateBody(occupancySchema), asyncHandler(async (req, res) => {
  const site = await ReliefSite.findById(req.params.id);
  if (!site) throw new NotFoundError('Relief site not found');
  if (req.body.currentOccupancy > site.capacity) {
    throw new BadRequestError(`Occupancy cannot exceed capacity (${site.capacity})`);
  }
  site.currentOccupancy = req.body.currentOccupancy;
  if (site.currentOccupancy >= site.capacity) site.status = 'FULL';
  else if (site.status === 'FULL') site.status = 'ACTIVE';
  await site.save();
  await logAudit({ req, action: 'SHELTER_OCCUPANCY_UPDATED', entityType: 'ReliefSite', entityId: req.params.id, metadata: { occupancy: req.body.currentOccupancy } });
  emitEvent('shelter:updated', site.toJSON());
  sendSuccess(res, site.toJSON(), 'Occupancy updated');
}));

export default router;
