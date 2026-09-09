export type UserRole = 'CITIZEN' | 'VOLUNTEER' | 'NGO' | 'GOVERNMENT' | 'ADMIN';

export const NEED_TYPES = ['MEDICAL', 'WATER', 'FOOD', 'SHELTER', 'CLOTHING', 'RESCUE', 'MISSING_PERSON', 'EVACUATION', 'OTHER'] as const;
export type NeedType = (typeof NEED_TYPES)[number];

export const URGENCY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export type Urgency = (typeof URGENCY_LEVELS)[number];

export const REPORT_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED', 'CLAIMED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface Report {
  _id: string;
  reporter?: string | { _id: string; fullName?: string };
  reporterContact?: string;
  title: string;
  description: string;
  needType: NeedType;
  urgency: Urgency;
  status: ReportStatus;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FLAGGED';
  location: GeoPoint;
  province?: string;
  district: string;
  municipality?: string;
  ward?: number;
  address?: string;
  affectedPeople: number;
  requiredQuantity: number;
  quantityUnit?: string;
  deliveredQuantity?: number;
  images: string[];
  voiceUrl?: string | null;
  source: string;
  verificationScore?: number;
  flags?: string[];
  requireProof?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  claimedBy?: string | { _id: string; name?: string; type?: string } | null;
  claimedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  district?: string;
  province?: string;
  municipality?: string;
  ward?: number;
  language?: 'en' | 'ne';
  isVerified?: boolean;
}

export interface Organization {
  _id: string;
  name: string;
  type: string;
  description?: string;
  email?: string;
  phone?: string;
  logo?: string;
  registrationNumber?: string;
  district?: string;
  province?: string;
  municipality?: string;
  ward?: number;
  location?: GeoPoint;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  trustScore: number;
  members?: { user: string | AuthUser; roleInOrg: 'ADMIN' | 'MEMBER' }[];
  createdAt: string;
}

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  entity?: { kind: string; id?: string };
  isRead: boolean;
  createdAt: string;
}

export interface MissingPerson {
  _id: string;
  fullName: string;
  photo?: string;
  age?: number;
  gender?: string;
  lastSeenLocation: string;
  lastSeenWard?: number;
  district?: string;
  description?: string;
  contactPhone?: string;
  status: 'SEARCHING' | 'FOUND_SAFE' | 'FOUND_DECEASED' | 'CLOSED';
  matchedShelter?: string | { _id: string; name?: string };
  createdAt: string;
}

export interface ReliefSite {
  _id: string;
  name: string;
  siteType: 'SHELTER' | 'WAREHOUSE';
  location: GeoPoint;
  district?: string;
  province?: string;
  municipality?: string;
  ward?: number;
  address?: string;
  capacity: number;
  currentOccupancy: number;
  contact?: string;
  managedBy?: string | { _id: string; name?: string };
  status: 'ACTIVE' | 'FULL' | 'CLOSED';
  notes?: string;
}

export interface InventoryItem {
  _id: string;
  warehouse: string | { _id: string; name?: string; district?: string };
  itemType: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface InventoryTransaction {
  _id: string;
  item: string | { _id: string; itemType?: string };
  warehouse: string;
  transactionType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantityChanged: number;
  performedBy?: string | { _id: string; fullName?: string };
  relatedReport?: string | null;
  notes?: string;
  createdAt: string;
}

export interface Donation {
  _id: string;
  donorReference?: string;
  donorName?: string;
  amountNPR: number;
  linkedReport?: string | { _id: string; title?: string };
  organization?: string | { _id: string; name?: string };
  status: 'RECEIVED' | 'ALLOCATED' | 'DISBURSED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Hazard {
  _id: string;
  type: string;
  title: string;
  description?: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  source: string;
  location?: string;
  district?: string;
  affectedArea?: string[];
  startTime?: string;
  endTime?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  isMock?: boolean;
}

export interface AuditLog {
  _id: string;
  actor?: { _id: string; fullName?: string; role?: string } | null;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface Delivery {
  _id: string;
  report: string | { _id: string; title?: string; needType?: string; district?: string };
  organization: string | { _id: string; name?: string };
  deliveredBy?: string | { _id: string; fullName?: string };
  quantityDelivered: number;
  recipientCount?: number;
  deliveryLocation?: { address?: string; coordinates?: number[]; ward?: number };
  proofImages: string[];
  notes?: string;
  deliveredAt: string;
}

export interface Verification {
  _id: string;
  report?: string | { _id: string; title?: string; needType?: string; urgency?: string; status?: string; district?: string };
  volunteer?: string | { _id: string; fullName?: string };
  decision: 'VERIFIED' | 'REJECTED' | 'FLAGGED';
  notes?: string;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
