import { Router } from 'express';
import { AuditLog } from '../auditLogs/auditLog.model';
import { Settings } from './settings.model';
import { authenticate, authorize } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta, escapeRegex } from '../../core/utils/helpers';
import { Report } from '../reports/report.model';
import { User } from '../users/user.model';
import { Organization } from '../organizations/organization.model';
import { ReliefSite } from '../reliefSites/reliefSite.model';
import { InventoryItem } from '../inventory/inventory.model';
import { Donation } from '../donations/donation.model';
import { MissingPerson } from '../missingPersons/missingPerson.model';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard-stats', asyncHandler(async (_req, res) => {
  const [totalReports, pending, verified, rejected, claimed, resolved, critical, organizations, volunteers, shelters, capacity, inventory, donations, missingPersons] =
    await Promise.all([
      Report.countDocuments({}),
      Report.countDocuments({ status: 'PENDING' }),
      Report.countDocuments({ status: 'VERIFIED' }),
      Report.countDocuments({ status: 'REJECTED' }),
      Report.countDocuments({ status: 'CLAIMED' }),
      Report.countDocuments({ status: 'RESOLVED' }),
      Report.countDocuments({ urgency: 'CRITICAL' }),
      Organization.countDocuments({}),
      User.countDocuments({ role: 'VOLUNTEER' }),
      ReliefSite.countDocuments({ siteType: 'SHELTER' }),
      ReliefSite.aggregate([{ $match: { siteType: 'SHELTER' } }, { $group: { _id: null, v: { $sum: '$capacity' } } }]),
      InventoryItem.countDocuments({}),
      Donation.aggregate([{ $match: { status: { $ne: 'CANCELLED' } } }, { $group: { _id: null, v: { $sum: '$amountNPR' } } }]),
      MissingPerson.countDocuments({ status: 'SEARCHING' }),
    ]);

  sendSuccess(res, {
    totalReports, pending, verified, rejected, claimed, resolved, critical,
    organizations, volunteers, shelters,
    shelterCapacity: capacity[0]?.v ?? 0,
    inventoryItems: inventory,
    donationTotalNPR: donations[0]?.v ?? 0,
    searchingMissingPersons: missingPersons,
  }, 'Admin dashboard stats');
}));

router.get('/audit-logs', asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (req.query.action) filter.action = new RegExp(escapeRegex(String(req.query.action)), 'i');
  if (req.query.entityType) filter.entityType = req.query.entityType;
  if (req.query.actor) filter.actor = req.query.actor;

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('actor', 'fullName role'),
    AuditLog.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((i) => i.toJSON()), 'Audit logs fetched', 200, buildPaginationMeta(total, page, limit));
}));

router.get('/settings', asyncHandler(async (_req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  sendSuccess(res, settings.toJSON(), 'Settings fetched');
}));

router.patch('/settings', validateBody(z.object({
  maintenanceMode: z.boolean().optional(),
  defaultRequireProof: z.boolean().optional(),
  reportRetentionDays: z.number().int().min(30).max(3650).optional(),
  allowSelfRegistration: z.boolean().optional(),
  emergencyMessage: z.string().max(500).optional(),
})), asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  Object.assign(settings, req.body);
  await settings.save();
  sendSuccess(res, settings.toJSON(), 'Settings updated');
}));

export default router;
