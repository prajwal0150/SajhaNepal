import { Report } from '../reports/report.model';
import { Organization } from '../organizations/organization.model';
import { emitEvent } from '../../sockets';
import { createNotification } from '../notifications/notification.service';
import { logAudit } from '../auditLogs/auditLog.service';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../../core/errors/appError';
import { Request } from 'express';

export class ClaimService {
  /**
   * ATOMIC NGO CLAIMING — race-condition safe.
   * Uses a guarded findOneAndUpdate: the claim only succeeds if the report is
   * still VERIFIED and unclaimed. Two NGOs claiming concurrently: exactly one wins.
   */
  static async claimReport(
    reportId: string,
    organizationId: string,
    userId: string,
    notes: string,
    req: Request,
  ): Promise<Record<string, unknown>> {
    const org = await Organization.findOne({
      _id: organizationId,
      'members.user': userId,
    });
    if (!org) throw new ForbiddenError('You are not a member of this organization');
    if (org.verificationStatus !== 'VERIFIED') {
      throw new ForbiddenError('Organization must be verified before claiming needs');
    }

    const claimed = await Report.findOneAndUpdate(
      {
        _id: reportId,
        status: 'VERIFIED',
        claimedBy: null,
      },
      {
        $set: {
          status: 'CLAIMED',
          claimedBy: organizationId,
          claimedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!claimed) {
      const existing = await Report.findById(reportId);
      if (!existing) throw new NotFoundError('Report not found');
      if (existing.status !== 'VERIFIED') {
        throw new ConflictError(`This need cannot be claimed (status: ${existing.status})`);
      }
      throw new ConflictError('This need has already been claimed.');
    }

    await logAudit({
      req,
      action: 'REPORT_CLAIMED',
      entityType: 'Report',
      entityId: reportId,
      metadata: { organizationId, organizationName: org.name, notes },
    });

    await createNotification({
      userId: claimed.reporter ? String(claimed.reporter) : null,
      type: 'REPORT_CLAIMED',
      title: 'Your need was claimed',
      message: `${org.name} claimed "${claimed.title}"`,
      entity: { kind: 'report', id: reportId },
    });

    emitEvent('report:claimed', claimed.toJSON());
    return claimed.toJSON();
  }

  static async getMyClaims(req: Request): Promise<Record<string, unknown>[]> {
    const orgs = await Organization.find({ 'members.user': req.user?.id }).select('_id');
    const orgIds = orgs.map((o) => o._id);
    return Report.find({ claimedBy: { $in: orgIds } })
      .sort({ claimedAt: -1 })
      .populate('claimedBy', 'name type')
      .lean();
  }

  /** CLAIMED → IN_PROGRESS (start operation). */
  static async startOperation(claimReportId: string, userId: string, req: Request): Promise<Record<string, unknown>> {
    const report = await Report.findById(claimReportId);
    if (!report) throw new NotFoundError('Report not found');

    const org = await Organization.findOne({ _id: report.claimedBy, 'members.user': userId });
    if (!org) throw new ForbiddenError('This claim belongs to another organization');

    ReportService_transitions(report);
    report.status = 'IN_PROGRESS';
    await report.save();

    await logAudit({ req, action: 'OPERATION_STARTED', entityType: 'Report', entityId: claimReportId, metadata: { organizationId: String(org._id) } });
    emitEvent('report:updated', report.toJSON());
    return report.toJSON();
  }

  /** Release claim: CLAIMED → VERIFIED, unassign org (atomic). */
  static async releaseClaim(reportId: string, userId: string, req: Request): Promise<Record<string, unknown>> {
    const report = await Report.findById(reportId);
    if (!report) throw new NotFoundError('Report not found');
    const org = await Organization.findOne({ _id: report.claimedBy, 'members.user': userId });
    if (!org) throw new ForbiddenError('This claim belongs to another organization');

    const released = await Report.findOneAndUpdate(
      { _id: reportId, status: 'CLAIMED', claimedBy: org._id },
      { $set: { status: 'VERIFIED', claimedBy: null, claimedAt: null } },
      { new: true },
    );
    if (!released) throw new ConflictError('Claim cannot be released in current state');

    await logAudit({ req, action: 'CLAIM_RELEASED', entityType: 'Report', entityId: reportId, metadata: { organizationId: String(org._id) } });
    emitEvent('report:updated', released.toJSON());
    return released.toJSON();
  }
}

function ReportService_transitions(report: { status: string }): void {
  if (report.status !== 'CLAIMED') {
    throw new BadRequestError(`Cannot start operation on a report with status ${report.status}`);
  }
}
