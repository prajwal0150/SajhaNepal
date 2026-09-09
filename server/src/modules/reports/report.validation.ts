import { z } from 'zod';
import { NEED_TYPES, URGENCY_LEVELS, REPORT_STATUSES, VERIFICATION_STATUSES } from './report.types';
import { PROVINCES } from './report.types';

export const reportCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(3000),
  needType: z.enum(NEED_TYPES),
  urgency: z.enum(URGENCY_LEVELS).optional(),
  longitude: z.coerce.number().min(79.5).max(88.5),
  latitude: z.coerce.number().min(26).max(30.8),
  province: z.enum(PROVINCES).optional().or(z.string().min(1).max(60)),
  district: z.string().min(1).max(60),
  municipality: z.string().max(80).optional().default(''),
  ward: z.coerce.number().int().min(1).max(35).optional(),
  address: z.string().max(300).optional().default(''),
  affectedPeople: z.coerce.number().int().min(0).max(100000).optional().default(1),
  requiredQuantity: z.coerce.number().min(0).optional().default(1),
  quantityUnit: z.string().max(30).optional().default('units'),
  reporterContact: z.string().max(30).optional().default(''),
  consent: z.coerce.boolean().refine((v) => v === true, 'Consent is required'),
});

export const reportListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().max(120).optional(),
  needType: z.enum(NEED_TYPES).optional(),
  urgency: z.enum(URGENCY_LEVELS).optional(),
  status: z.enum(REPORT_STATUSES).optional(),
  verificationStatus: z.enum(VERIFICATION_STATUSES).optional(),
  province: z.string().max(60).optional(),
  district: z.string().max(60).optional(),
  municipality: z.string().max(80).optional(),
  ward: z.coerce.number().int().min(1).max(35).optional(),
  claimedBy: z.string().max(60).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().min(0.1).max(500).optional(),
});

export const reportUpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(3000).optional(),
  urgency: z.enum(URGENCY_LEVELS).optional(),
  district: z.string().max(60).optional(),
  municipality: z.string().max(80).optional(),
  ward: z.coerce.number().int().min(1).max(35).optional(),
  affectedPeople: z.coerce.number().int().min(0).optional(),
  requiredQuantity: z.coerce.number().min(0).optional(),
});

export const verificationCreateSchema = z.object({
  reportId: z.string().min(1),
  decision: z.enum(['VERIFIED', 'REJECTED', 'FLAGGED']),
  notes: z.string().max(2000).optional().default(''),
  urgencyOverride: z.enum(URGENCY_LEVELS).optional(),
});

export const claimCreateSchema = z.object({
  reportId: z.string().min(1),
  organizationId: z.string().min(1),
  notes: z.string().max(1000).optional().default(''),
});
