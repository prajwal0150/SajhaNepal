import { Request } from 'express';
import { Report } from '../reports/report.model';
import { ReliefSite } from '../reliefSites/reliefSite.model';
import { Delivery } from '../deliveries/delivery.model';
import { User } from '../users/user.model';
import { Organization } from '../organizations/organization.model';
import { InventoryItem } from '../inventory/inventory.model';

export class AnalyticsService {
  static async overview(req: Request): Promise<Record<string, unknown>> {
    const role = req.user?.role ?? 'PUBLIC';
    const base: Record<string, unknown> = role === 'PUBLIC' ? { status: { $in: ['VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'RESOLVED'] } } : {};

    const [totalReports, pending, verified, claimed, inProgress, resolved, rejected, critical, orgs, volunteers, shelters, capacity] =
      await Promise.all([
        Report.countDocuments(base),
        Report.countDocuments({ ...base, status: 'PENDING' }),
        Report.countDocuments({ ...base, status: 'VERIFIED' }),
        Report.countDocuments({ ...base, status: 'CLAIMED' }),
        Report.countDocuments({ ...base, status: 'IN_PROGRESS' }),
        Report.countDocuments({ ...base, status: 'RESOLVED' }),
        Report.countDocuments({ ...base, status: 'REJECTED' }),
        Report.countDocuments({ ...base, urgency: 'CRITICAL' }),
        Organization.countDocuments({ verificationStatus: 'VERIFIED' }),
        User.countDocuments({ role: 'VOLUNTEER' }),
        ReliefSite.countDocuments({ siteType: 'SHELTER' }),
        ReliefSite.aggregate([{ $match: { siteType: 'SHELTER' } }, { $group: { _id: null, capacity: { $sum: '$capacity' }, occupancy: { $sum: '$currentOccupancy' } } }]),
      ]);

    return {
      totalReports, pending, verified, claimed, inProgress, resolved, rejected, critical,
      organizations: orgs, volunteers, shelters,
      shelterCapacity: capacity[0]?.capacity ?? 0,
      shelterOccupancy: capacity[0]?.occupancy ?? 0,
    };
  }

  static async reportAnalytics(): Promise<Record<string, unknown>> {
    const [byNeedType, byUrgency, byDistrict, byStatus, overTime] = await Promise.all([
      Report.aggregate([{ $group: { _id: '$needType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Report.aggregate([{ $group: { _id: '$urgency', count: { $sum: 1 } } }]),
      Report.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }]),
      Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Report.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 60 },
      ]),
    ]);

    const [total, verificationCount, claimCount, resolutionCount] = await Promise.all([
      Report.countDocuments({}),
      Report.countDocuments({ verificationStatus: { $in: ['VERIFIED', 'REJECTED', 'FLAGGED'] } }),
      Report.countDocuments({ claimedBy: { $ne: null } }),
      Report.countDocuments({ status: 'RESOLVED' }),
    ]);

    const avgResponse = await Report.aggregate([
      { $match: { claimedAt: { $exists: true }, createdAt: { $exists: true } } },
      { $project: { diff: { $subtract: ['$claimedAt', '$createdAt'] } } },
      { $group: { _id: null, avgMs: { $avg: '$diff' } } },
    ]);

    return {
      byNeedType, byUrgency, byDistrict, byStatus, overTime,
      verificationRate: total ? Math.round((verificationCount / total) * 100) : 0,
      claimRate: total ? Math.round((claimCount / total) * 100) : 0,
      resolutionRate: total ? Math.round((resolutionCount / total) * 100) : 0,
      averageResponseHours: avgResponse[0]?.avgMs ? Math.round((avgResponse[0].avgMs / 3600000) * 10) / 10 : null,
    };
  }

  static async performance(): Promise<Record<string, unknown>> {
    const [ngoPerf, volunteerPerf, deliveries] = await Promise.all([
      Organization.aggregate([
        { $match: { verificationStatus: 'VERIFIED' } },
        { $lookup: { from: 'reports', localField: '_id', foreignField: 'claimedBy', as: 'claims' } },
        { $project: {
          name: 1, type: 1, trustScore: 1,
          totalClaims: { $size: '$claims' },
          resolved: { $size: { $filter: { input: '$claims', cond: { $eq: ['$$this.status', 'RESOLVED'] } } } },
        } },
        { $sort: { resolved: -1 } },
        { $limit: 10 },
      ]),
      (await import('../verification/verification.model')).Verification.aggregate([
        { $group: { _id: '$volunteer', decisions: { $sum: 1 } } },
        { $sort: { decisions: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $project: { decisions: 1, fullName: { $first: '$user.fullName' } } },
      ]),
      Delivery.countDocuments({}),
    ]);
    return { ngoPerformance: ngoPerf, volunteerPerformance: volunteerPerf, totalDeliveries: deliveries };
  }

  static async shelterAnalytics(): Promise<Record<string, unknown>[]> {
    return ReliefSite.aggregate([
      { $match: { siteType: 'SHELTER' } },
      { $project: { name: 1, district: 1, capacity: 1, currentOccupancy: 1, status: 1, available: { $subtract: ['$capacity', '$currentOccupancy'] } } },
      { $sort: { available: 1 } },
      { $limit: 20 },
    ]);
  }

  static async inventoryUsage(): Promise<Record<string, unknown>[]> {
    return InventoryItem.aggregate([
      { $group: { _id: '$itemType', totalQuantity: { $sum: '$quantity' }, warehouses: { $sum: 1 } } },
      { $sort: { totalQuantity: -1 } },
    ]);
  }
}
