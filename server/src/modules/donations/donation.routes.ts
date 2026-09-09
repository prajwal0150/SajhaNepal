import { Router } from 'express';
import { Donation } from './donation.model';
import { authenticate, authorize } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta } from '../../core/utils/helpers';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';
import { NotFoundError, BadRequestError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';

const donationSchema = z.object({
  donorReference: z.string().max(60).optional().default(''),
  donorName: z.string().max(120).optional().default(''),
  amountNPR: z.coerce.number().min(1, 'Amount must be at least NPR 1'),
  linkedReport: z.string().optional().default(''),
  organization: z.string().optional().default(''),
  notes: z.string().max(1000).optional().default(''),
});

const statusSchema = z.object({
  status: z.enum(['RECEIVED', 'ALLOCATED', 'DISBURSED', 'COMPLETED', 'CANCELLED']),
});

const router = Router();

/**
 * Public transparency ledger — safe fields only.
 * Donor identity is never exposed publicly.
 */
router.get('/transparency', asyncHandler(async (_req, res) => {
  const donations = await Donation.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('organization', 'name type')
    .populate('linkedReport', 'title needType district');
  const safe = donations.map((d) => {
    const json = d.toJSON();
    delete json.donorName;
    delete json.donorReference;
    delete json.disbursedBy;
    return json;
  });
  const total = await Donation.aggregate([
    { $match: { status: { $in: ['RECEIVED', 'ALLOCATED', 'DISBURSED', 'COMPLETED'] } } },
    { $group: { _id: null, totalNPR: { $sum: '$amountNPR' }, count: { $sum: 1 } } },
  ]);
  sendSuccess(res, safe, 'Donation transparency ledger', 200, total[0] ?? { totalNPR: 0, count: 0 });
}));

router.get('/', authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('organization', 'name type')
      .populate('linkedReport', 'title needType district'),
    Donation.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((d) => d.toJSON()), 'Donations fetched', 200, buildPaginationMeta(total, page, limit));
}));

router.post('/', authenticate, authorize('ADMIN', 'NGO'), validateBody(donationSchema), asyncHandler(async (req, res) => {
  const donation = await Donation.create({
    donorReference: req.body.donorReference || `REF-${Date.now()}`,
    donorName: req.body.donorName,
    amountNPR: req.body.amountNPR,
    linkedReport: req.body.linkedReport || null,
    organization: req.body.organization || null,
    notes: req.body.notes,
    status: 'RECEIVED',
  });
  await logAudit({ req, action: 'DONATION_RECORDED', entityType: 'Donation', entityId: String(donation._id), metadata: { amountNPR: req.body.amountNPR } });
  sendSuccess(res, donation.toJSON(), 'Donation recorded (manual ledger entry — no payment provider configured)', 201);
}));

router.patch('/:id/status', authenticate, authorize('ADMIN'), validateBody(statusSchema), asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) throw new NotFoundError('Donation not found');
  if (donation.status === 'COMPLETED') throw new BadRequestError('Completed donations cannot change status');
  donation.status = req.body.status;
  if (req.body.status === 'DISBURSED') donation.set('disbursedBy', req.user?.id);
  await donation.save();
  await logAudit({ req, action: 'DONATION_STATUS_CHANGED', entityType: 'Donation', entityId: String(donation._id), metadata: { status: req.body.status } });
  sendSuccess(res, donation.toJSON(), 'Donation status updated');
}));

export default router;
