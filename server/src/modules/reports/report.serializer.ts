import { Types } from 'mongoose';

interface ReportLike {
  _id?: Types.ObjectId;
  reporter?: unknown;
  verificationScore?: number;
  status?: string;
  toJSON(): Record<string, unknown>;
}

type ReportDoc = ReportLike;

export interface ReportQueryContext {
  user?: { id: string; role: string } | null;
}

/** Scope filter for listing: public sees only verified+, authenticated see own, staff see all. */
export function visibilityFilter(user?: { id: string; role: string } | null): Record<string, unknown> {
  if (!user) {
    return { status: { $in: ['VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'RESOLVED'] } };
  }
  if (['ADMIN', 'GOVERNMENT', 'VOLUNTEER'].includes(user.role)) {
    return {};
  }
  if (user.role === 'NGO') {
    return { $or: [{ status: { $in: ['VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'RESOLVED'] } }] };
  }
  return { $or: [{ reporter: user.id }, { status: { $in: ['VERIFIED', 'CLAIMED', 'IN_PROGRESS', 'RESOLVED'] } }] };
}

/** Convert a mongoose doc or lean object to a plain mutable object. */
function toPlain(doc: unknown): Record<string, unknown> {
  if (doc && typeof (doc as { toJSON?: unknown }).toJSON === 'function') {
    return (doc as { toJSON: () => Record<string, unknown> }).toJSON();
  }
  return { ...(doc as Record<string, unknown>) };
}

/** PublicReport — strips all private/moderation data (privacy requirement). */
export function serializePublicReport(report: ReportDoc | Record<string, unknown>): Record<string, unknown> {
  const r = toPlain(report);
  delete r.reporter;
  delete r.reporterContact;
  delete r.fraudScore;
  delete r.duplicateScore;
  delete r.flags;
  delete r.verificationScore;
  delete r.transcription;
  delete r.voiceUrl;
  delete r.__v;
  return r;
}

/** AuthenticatedReport — owner/volunteer/responder view. */
export function serializeAuthenticatedReport(report: ReportDoc | Record<string, unknown>): Record<string, unknown> {
  const r = toPlain(report);
  delete r.fraudScore;
  delete r.duplicateScore;
  delete r.flags;
  return r;
}

/** AdminReport — full data. */
export function serializeAdminReport(report: ReportDoc | Record<string, unknown>): Record<string, unknown> {
  const r = toPlain(report);
  delete r.__v;
  return r;
}

export function serializeForRole(
  report: ReportDoc | Record<string, unknown>,
  user?: { id: string; role: string } | null,
): Record<string, unknown> {
  if (user && ['ADMIN', 'GOVERNMENT'].includes(user.role)) {
    return serializeAdminReport(report);
  }
  const reporter = (report as { reporter?: unknown }).reporter;
  const reporterId = reporter && typeof reporter === 'object' && reporter !== null
    ? String((reporter as { _id?: unknown })._id ?? reporter)
    : String(reporter ?? '');
  const isOwner = user && reporterId === user.id;
  if (user && (isOwner || user.role === 'VOLUNTEER')) {
    return serializeAuthenticatedReport(report);
  }
  return serializePublicReport(report);
}
