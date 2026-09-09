import { Router } from 'express';
import {
  listOrganizations,
  getOrganization,
  getMyOrganizations,
  createOrganization,
  updateOrganization,
  addMember,
  verifyOrganization,
  getMembers,
} from './organization.controller';
import { authenticate, authorize, optionalAuthenticate } from '../../core/middleware/auth';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';
import { ORG_TYPES } from './organization.types';

const createSchema = z.object({
  name: z.string().min(2).max(150),
  type: z.enum(ORG_TYPES).default('NGO'),
  description: z.string().max(2000).optional().default(''),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional().default(''),
  logo: z.string().max(500).optional().default(''),
  registrationNumber: z.string().max(60).optional().default(''),
  address: z.string().max(300).optional().default(''),
  province: z.string().max(60).optional().default(''),
  district: z.string().max(60).optional().default(''),
  municipality: z.string().max(80).optional().default(''),
  ward: z.coerce.number().int().min(1).max(35).optional(),
  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([z.coerce.number(), z.coerce.number()]),
    })
    .optional(),
});

const verifySchema = z.object({
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('VERIFIED'),
});

const memberSchema = z.object({
  userId: z.string().min(1),
  roleInOrg: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
});

const router = Router();

router.get('/', optionalAuthenticate, listOrganizations);
router.get('/my', authenticate, getMyOrganizations);
router.get('/:id', getOrganization);
router.get('/:id/members', authenticate, getMembers);

router.post('/', authenticate, authorize('NGO', 'CITIZEN'), validateBody(createSchema), createOrganization);
router.patch('/:id', authenticate, validateBody(createSchema.partial()), updateOrganization);
router.post('/:id/members', authenticate, validateBody(memberSchema), addMember);
router.patch('/:id/verify', authenticate, authorize('ADMIN'), validateBody(verifySchema), verifyOrganization);

export default router;
