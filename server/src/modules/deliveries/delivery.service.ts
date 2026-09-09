import mongoose from 'mongoose';
import { Report } from '../reports/report.model';
import { Delivery } from './delivery.model';
import { Organization } from '../organizations/organization.model';
import { emitEvent } from '../../sockets';
import { createNotification } from '../notifications/notification.service';
import { logAudit } from '../auditLogs/auditLog.service';
import { TrustScoreService } from '../analytics/trustScore.service';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../core/errors/appError';
import { Request } from 'express';
import { uploadBuffer } from '../../integrations/cloudinary/cloudinary.service';

export interface CreateDeliveryInput {
  reportId: string;
  organizationId: string;
  quantityDelivered: number;
  recipientCount?: number;
  deliveryLocation?: { address?: string; coordinates?: number[]; ward?: number };
  notes?: string;
}

export class DeliveryService {
  /**
   * Record delivery + proof. Uses a MongoDB session transaction when available
   * (replica set) with safe fallback for standalone dev servers.
   * A report may only become RESOLVED with proof images when proof is required.
   */
  static async createDelivery(
    input: CreateDeliveryInput,
    files: Express.Multer.File[],
    req: Request,
  ): Promise<Record<string, unknown>> {
    const report = await Report.findById(input.reportId);
    if (!report) throw new NotFoundError('Report not found');

    const org = await Organization.findOne({ _id: input.organizationId, 'members.user': req.user?.id });
    if (!org) throw new ForbiddenError('You are not a member of this organization');
    if (!report.claimedBy || String(report.claimedBy) !== input.organizationId) {
      throw new ForbiddenError('This report is not claimed by your organization');
    }
    if (!['CLAIMED', 'IN_PROGRESS'].includes(report.status)) {
      throw new BadRequestError(`Cannot record delivery for a report with status ${report.status}`);
    }

    const proofImages: string[] = [];
    for (const file of files) {
      const result = await uploadBuffer(file.buffer, file.originalname, 'deliveries/proof');
      proofImages.push(result.url);
    }

    if (report.requireProof && proofImages.length === 0 && input.quantityDelivered >= report.requiredQuantity) {
      throw new BadRequestError('Proof of delivery is required to fulfil this need. Upload at least one photo.');
    }

    const delivery = new Delivery({
      report: input.reportId,
      organization: input.organizationId,
      deliveredBy: req.user?.id,
      quantityDelivered: input.quantityDelivered,
      recipientCount: input.recipientCount,
      deliveryLocation: input.deliveryLocation,
      proofImages,
      notes: input.notes,
      deliveredAt: new Date(),
    });

    report.deliveredQuantity = (report.deliveredQuantity ?? 0) + input.quantityDelivered;
    const fulfilled = report.deliveredQuantity >= report.requiredQuantity;

    if (fulfilled) {
      if (report.requireProof && proofImages.length === 0) {
        throw new BadRequestError('Proof of delivery is required before resolving this need');
      }
      report.status = 'RESOLVED';
      report.resolvedAt = new Date();
    } else if (report.status === 'CLAIMED') {
      report.status = 'IN_PROGRESS';
    }

    const session = await mongoose.startSession();
    try {
      let saved = false;
      await session.withTransaction(async () => {
        await delivery.save({ session });
        await report.save({ session });
        saved = true;
      });
      if (!saved) throw new Error('transaction-aborted');
    } catch {
      // Standalone mongod (no replica set) — fall back to sequential save
      await delivery.save();
      await report.save();
    } finally {
      await session.endSession();
    }

    await logAudit({
      req,
      action: 'DELIVERY_SUBMITTED',
      entityType: 'Delivery',
      entityId: String(delivery._id),
      metadata: { reportId: input.reportId, quantityDelivered: input.quantityDelivered, resolved: report.status === 'RESOLVED' },
    });

    await createNotification({
      userId: report.reporter ? String(report.reporter) : null,
      type: report.status === 'RESOLVED' ? 'REPORT_RESOLVED' : 'DELIVERY_SUBMITTED',
      title: report.status === 'RESOLVED' ? 'Your need was fulfilled' : 'Delivery recorded',
      message: `${org.name} delivered ${input.quantityDelivered} ${report.quantityUnit} — "${report.title}"`,
      entity: { kind: 'report', id: input.reportId },
    });

    await TrustScoreService.updateOrganizationTrust(input.organizationId);

    emitEvent('delivery:submitted', delivery.toJSON());
    if (report.status === 'RESOLVED') emitEvent('report:resolved', report.toJSON());

    return { delivery: delivery.toJSON(), report: report.toJSON() };
  }

  static async getMyDeliveries(req: Request): Promise<Record<string, unknown>[]> {
    const orgs = await Organization.find({ 'members.user': req.user?.id }).select('_id');
    const orgIds = orgs.map((o) => o._id);
    return Delivery.find({ organization: { $in: orgIds } })
      .sort({ deliveredAt: -1 })
      .populate('report', 'title needType urgency district')
      .populate('organization', 'name type')
      .lean();
  }

  static async getDeliveriesForReport(reportId: string): Promise<Record<string, unknown>[]> {
    return Delivery.find({ report: reportId })
      .sort({ deliveredAt: -1 })
      .populate('organization', 'name type')
      .lean();
  }
}
