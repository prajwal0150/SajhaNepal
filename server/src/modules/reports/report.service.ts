import { FilterQuery } from 'mongoose';
import { Request } from 'express';
import { Report } from './report.model';
import { Verification } from '../verification/verification.model';
import { ReportStatus, Urgency, STATUS_TRANSITIONS } from './report.types';
import { classifyUrgency } from './urgencyEngine';
import { assessFraud } from './fraud.service';
import { uploadBuffer } from '../../integrations/cloudinary/cloudinary.service';
import { createNotification, notifyRole } from '../notifications/notification.service';
import { logAudit } from '../auditLogs/auditLog.service';
import { emitEvent } from '../../sockets';
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from '../../core/errors/appError';
import { visibilityFilter, serializeForRole, serializeAuthenticatedReport } from './report.serializer';
import { escapeRegex, getPagination, buildPaginationMeta, PaginationMeta } from '../../core/utils/helpers';

interface ListResult {
  items: Record<string, unknown>[];
  meta: PaginationMeta;
}

interface CreateReportInput {
  title: string;
  description: string;
  needType: string;
  urgency?: Urgency;
  longitude: number;
  latitude: number;
  province?: string;
  district: string;
  municipality?: string;
  ward?: number;
  address?: string;
  affectedPeople?: number;
  requiredQuantity?: number;
  quantityUnit?: string;
  reporterContact?: string;
  consent: boolean;
}

export class ReportService {
  static async createReport(
    input: CreateReportInput,
    files: { images?: Express.Multer.File[]; voice?: Express.Multer.File[] },
    req: Request,
  ): Promise<Record<string, unknown>> {
    const urgency: Urgency = input.urgency ?? classifyUrgency({
      title: input.title,
      description: input.description,
      needType: input.needType as never,
    });

    const fraud = await assessFraud({
      title: input.title,
      description: input.description,
      reporterContact: input.reporterContact,
      reporter: req.user?.id,
      coordinates: [input.longitude, input.latitude],
      needType: input.needType,
    });

    const imageUrls: string[] = [];
    for (const file of files.images ?? []) {
      const result = await uploadBuffer(file.buffer, file.originalname, 'reports/images');
      imageUrls.push(result.url);
    }
    let voiceUrl: string | undefined;
    if (files.voice?.[0]) {
      const result = await uploadBuffer(files.voice[0].buffer, files.voice[0].originalname, 'reports/voice');
      voiceUrl = result.url;
    }

    const report = await Report.create({
      reporter: req.user?.id ?? null,
      reporterContact: input.reporterContact,
      title: input.title,
      description: input.description,
      needType: input.needType,
      urgency,
      status: 'PENDING',
      verificationStatus: 'PENDING',
      location: { type: 'Point', coordinates: [input.longitude, input.latitude] },
      province: input.province,
      district: input.district,
      municipality: input.municipality,
      ward: input.ward,
      address: input.address,
      affectedPeople: input.affectedPeople,
      requiredQuantity: input.requiredQuantity,
      quantityUnit: input.quantityUnit,
      images: imageUrls,
      voiceUrl,
      duplicateScore: fraud.duplicateScore,
      fraudScore: fraud.fraudScore,
      flags: fraud.flags,
      consent: input.consent,
      source: 'WEB',
      verificationScore: fraud.fraudScore > 40 || fraud.duplicateScore > 60 ? 20 : 70,
    });

    await logAudit({
      req,
      action: 'REPORT_CREATED',
      entityType: 'Report',
      entityId: String(report._id),
      metadata: { needType: input.needType, urgency, district: input.district },
    });

    if (urgency === 'CRITICAL') {
      await notifyRole('VOLUNTEER', {
        type: 'NEW_CRITICAL_NEED',
        title: 'Critical need reported',
        message: `${input.title} — ${input.district}`,
        entity: { kind: 'report', id: String(report._id) },
      });
    }

    emitEvent('report:created', report.toJSON());
    return report.toJSON();
  }

  static async listReports(req: Request): Promise<ListResult> {
    const { page, limit, skip } = getPagination(req);
    const q = req.query;

    const filter: FilterQuery<unknown> = { ...visibilityFilter(req.user) };
    if (q.search) {
      const rx = new RegExp(escapeRegex(String(q.search)), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { district: rx }, { municipality: rx }];
    }
    if (q.needType) filter.needType = q.needType;
    if (q.urgency) filter.urgency = q.urgency;
    if (q.status) filter.status = q.status;
    if (q.verificationStatus) filter.verificationStatus = q.verificationStatus;
    if (q.province) filter.province = new RegExp(escapeRegex(String(q.province)), 'i');
    if (q.district) filter.district = new RegExp(escapeRegex(String(q.district)), 'i');
    if (q.municipality) filter.municipality = new RegExp(escapeRegex(String(q.municipality)), 'i');
    if (q.ward) filter.ward = Number(q.ward);
    if (q.claimedBy) filter.claimedBy = q.claimedBy;
    if (q.from || q.to) {
      filter.createdAt = {
        ...(q.from ? { $gte: new Date(String(q.from)) } : {}),
        ...(q.to ? { $lte: new Date(String(q.to)) } : {}),
      };
    }
    if (q.lat && q.lng && q.radiusKm) {
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(q.lng), Number(q.lat)] },
          $maxDistance: Number(q.radiusKm) * 1000,
        },
      };
    }

    const [items, total] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        .populate('claimedBy', 'name type').lean(),
      Report.countDocuments(filter),
    ]);
    return { items: items.map((r) => serializeForRole(r, req.user)), meta: buildPaginationMeta(total, page, limit) };
  }

  static async getNearbyReports(
    lat: number,
    lng: number,
    radiusKm: number,
    limit = 200,
    extra: { needType?: string; urgency?: string } = {},
  ): Promise<Record<string, unknown>[]> {
    const filter: FilterQuery<unknown> = {
      ...visibilityFilter(null),
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
    };
    if (extra.needType) filter.needType = extra.needType;
    if (extra.urgency) filter.urgency = extra.urgency;
    return Report.find(filter).limit(limit).lean();
  }

  static async getReportById(id: string, req: Request): Promise<Record<string, unknown>> {
    const report = await Report.findById(id).populate('claimedBy', 'name type');
    if (!report) throw new NotFoundError('Report not found');

    const isOwner = req.user && report.reporter && String(report.reporter) === req.user.id;
    const isStaff = req.user && ['ADMIN', 'GOVERNMENT', 'VOLUNTEER'].includes(req.user.role);
    const isPublicVisible = ['VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'RESOLVED'].includes(report.status);
    if (!isPublicVisible && !isOwner && !isStaff) {
      throw new ForbiddenError('This report is not publicly visible');
    }

    const { serializeForRole } = await import('./report.serializer');
    return serializeForRole(report as never, req.user);
  }

  static async getMyReports(req: Request): Promise<ListResult> {
    const { page, limit, skip } = getPagination(req);
    const filter = { reporter: req.user?.id };
    const [items, total] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Report.countDocuments(filter),
    ]);
    return { items: items.map((r) => serializeAuthenticatedReport(r)), meta: buildPaginationMeta(total, page, limit) };
  }

  static async updateReport(id: string, updates: Record<string, unknown>, req: Request): Promise<Record<string, unknown>> {
    const report = await Report.findById(id);
    if (!report) throw new NotFoundError('Report not found');
    Object.assign(report, updates);
    await report.save();
    await logAudit({ req, action: 'REPORT_UPDATED', entityType: 'Report', entityId: id, metadata: updates });
    emitEvent('report:updated', report.toJSON());
    return report.toJSON();
  }

  static async cancelReport(id: string, req: Request): Promise<Record<string, unknown>> {
    const report = await Report.findOne({ _id: id, reporter: req.user?.id });
    if (!report) throw new NotFoundError('Report not found');
    ReportService.assertTransition(report.status as ReportStatus, 'CANCELLED');
    report.status = 'CANCELLED';
    await report.save();
    await logAudit({ req, action: 'REPORT_CANCELLED', entityType: 'Report', entityId: id });
    emitEvent('report:updated', report.toJSON());
    return report.toJSON();
  }

  /** Volunteer verification — creates Verification, updates report via state machine, audits, notifies. */
  static async verifyReport(
    reportId: string,
    decision: 'VERIFIED' | 'REJECTED' | 'FLAGGED',
    notes: string,
    urgencyOverride: Urgency | undefined,
    req: Request,
  ): Promise<Record<string, unknown>> {
    const report = await Report.findById(reportId);
    if (!report) throw new NotFoundError('Report not found');
    if (report.verificationStatus !== 'PENDING') {
      throw new ConflictError(`Report has already been ${report.verificationStatus.toLowerCase()}`);
    }

    const verification = await Verification.create({
      report: reportId,
      volunteer: req.user?.id,
      decision,
      notes,
      urgencyOverride,
    });

    report.verificationStatus = decision;
    report.set('verifiedBy', req.user?.id);
    report.verifiedAt = new Date();

    if (decision === 'VERIFIED') {
      report.status = 'VERIFIED';
      if (urgencyOverride) report.urgency = urgencyOverride;
    } else if (decision === 'REJECTED') {
      report.status = 'REJECTED';
    } else {
      report.status = 'PENDING';
      report.verificationScore = Math.max(0, report.verificationScore - 30);
    }

    await report.save();

    await logAudit({
      req,
      action: `REPORT_${decision}`,
      entityType: 'Report',
      entityId: reportId,
      metadata: { verificationId: String(verification._id), notes },
    });

    await createNotification({
      userId: report.reporter ? String(report.reporter) : null,
      type: decision === 'VERIFIED' ? 'REPORT_VERIFIED' : 'REPORT_REJECTED',
      title: decision === 'VERIFIED' ? 'Your report was verified' : decision === 'REJECTED' ? 'Your report was rejected' : 'Your report was flagged for review',
      message: report.title,
      entity: { kind: 'report', id: reportId },
    });

    emitEvent(decision === 'VERIFIED' ? 'report:verified' : 'report:rejected', report.toJSON());
    return report.toJSON();
  }

  static async getVerificationsForReport(reportId: string): Promise<Record<string, unknown>[]> {
    return Verification.find({ report: reportId })
      .populate('volunteer', 'fullName role')
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getMyVerifications(req: Request): Promise<ListResult> {
    const { page, limit, skip } = getPagination(req);
    const filter = { volunteer: req.user?.id };
    const [items, total] = await Promise.all([
      Verification.find(filter)
        .populate('report', 'title needType urgency status district')
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Verification.countDocuments(filter),
    ]);
    return { items, meta: buildPaginationMeta(total, page, limit) };
  }

  static assertTransition(from: ReportStatus, to: ReportStatus): void {
    if (!STATUS_TRANSITIONS[from].includes(to)) {
      throw new BadRequestError(`Invalid status transition: ${from} → ${to}`);
    }
  }
}


