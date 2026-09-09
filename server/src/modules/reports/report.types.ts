export const NEED_TYPES = [
  'MEDICAL',
  'WATER',
  'FOOD',
  'SHELTER',
  'CLOTHING',
  'RESCUE',
  'MISSING_PERSON',
  'EVACUATION',
  'OTHER',
] as const;
export type NeedType = (typeof NEED_TYPES)[number];

export const URGENCY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export type Urgency = (typeof URGENCY_LEVELS)[number];

export const REPORT_STATUSES = [
  'PENDING',
  'VERIFIED',
  'REJECTED',
  'CLAIMED',
  'IN_PROGRESS',
  'RESOLVED',
  'CANCELLED',
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const VERIFICATION_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED', 'FLAGGED'] as const;
export type ReportVerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const REPORT_SOURCES = ['WEB', 'SMS', 'IVR', 'VOICE'] as const;
export type ReportSource = (typeof REPORT_SOURCES)[number];

export const VERIFICATION_DECISIONS = ['VERIFIED', 'REJECTED', 'FLAGGED'] as const;
export type VerificationDecision = (typeof VERIFICATION_DECISIONS)[number];

/** Valid report status transitions — enforced server-side, never trusted from client. */
export const STATUS_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  PENDING: ['VERIFIED', 'REJECTED', 'CANCELLED'],
  VERIFIED: ['CLAIMED', 'CANCELLED'],
  REJECTED: [],
  CLAIMED: ['IN_PROGRESS', 'VERIFIED'], // VERIFIED = claim released
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
  CANCELLED: [],
};

export const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim',
] as const;

/** Urgency engine — keyword based auto-classification, overridable by volunteer verification. */
export const URGENCY_KEYWORDS: Record<Urgency, string[]> = {
  CRITICAL: ['medical', 'emergency', 'unconscious', 'bleeding', 'critical', 'missing', 'drowning', 'trapped', 'no water', 'rescue', 'ambulance', 'injury', 'पानी छैन', 'घाइते'],
  HIGH: ['urgent', 'food', 'shelter', 'evacuate', 'evacuation', 'landslide', 'flood', 'सहायता', 'भोजन'],
  MEDIUM: ['clothing', 'blanket', 'tarpaulin', 'relief', 'सहयोग'],
  LOW: ['inquiry', 'question', 'information'],
};
