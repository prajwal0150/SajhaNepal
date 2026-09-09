import { Router, Request } from 'express';
import { MissingPerson } from './missingPerson.model';
import { authenticate, authorize, optionalAuthenticate } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta, escapeRegex } from '../../core/utils/helpers';
import { uploadImages } from '../../core/middleware/upload';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';
import { uploadBuffer } from '../../integrations/cloudinary/cloudinary.service';
import { emitEvent } from '../../sockets';

const createSchema = z.object({
  fullName: z.string().min(2, 'Full name required').max(120),
  age: z.coerce.number().int().min(0).max(130).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional().default('UNKNOWN'),
  lastSeenLocation: z.string().min(2).max(300),
  lastSeenWard: z.coerce.number().int().min(1).max(35).optional(),
  district: z.string().max(60).optional().default(''),
  description: z.string().max(2000).optional().default(''),
  contactPhone: z.string().max(20).optional().default(''),
});

const statusSchema = z.object({
  status: z.enum(['SEARCHING', 'FOUND_SAFE', 'FOUND_DECEASED', 'CLOSED']),
  matchedShelter: z.string().optional(),
});

const router = Router();

router.post('/', authenticate, uploadImages.single('photo'), validateBody(createSchema), asyncHandler(async (req, res) => {
  let photoUrl: string | undefined;
  if (req.file) {
    const result = await uploadBuffer(req.file.buffer, req.file.originalname, 'missing-persons');
    photoUrl = result.url;
  }
  const person = await MissingPerson.create({
    ...req.body,
    photo: photoUrl,
    reportedBy: req.user?.id,
    status: 'SEARCHING',
  });
  await logAudit({ req, action: 'MISSING_PERSON_REPORTED', entityType: 'MissingPerson', entityId: String(person._id) });
  sendSuccess(res, person.toJSON(), 'Missing person report submitted', 201);
}));

router.get('/', optionalAuthenticate, asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(String(req.query.search)), 'i');
    filter.$or = [{ fullName: rx }, { lastSeenLocation: rx }, { description: rx }];
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.district) filter.district = new RegExp(escapeRegex(String(req.query.district)), 'i');

  const [items, total] = await Promise.all([
    MissingPerson.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('reportedBy', 'fullName')
      .populate('matchedShelter', 'name address district'),
    MissingPerson.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((p) => p.toJSON()), 'Missing persons fetched', 200, buildPaginationMeta(total, page, limit));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const person = await MissingPerson.findById(req.params.id)
    .populate('reportedBy', 'fullName')
    .populate('matchedShelter', 'name address district contact');
  if (!person) throw new NotFoundError('Missing person not found');
  sendSuccess(res, person.toJSON(), 'Missing person fetched');
}));

router.patch('/:id/status', authenticate, authorize('ADMIN', 'GOVERNMENT'), validateBody(statusSchema), asyncHandler(async (req, res) => {
  const person = await MissingPerson.findById(req.params.id);
  if (!person) throw new NotFoundError('Missing person not found');
  person.status = req.body.status;
  if (req.body.matchedShelter) person.matchedShelter = req.body.matchedShelter;
  await person.save();
  await logAudit({ req, action: 'MISSING_PERSON_STATUS_CHANGED', entityType: 'MissingPerson', entityId: req.params.id, metadata: { status: req.body.status } });
  emitEvent('report:updated', { scope: 'missing-persons' });
  sendSuccess(res, person.toJSON(), 'Status updated');
}));

router.patch('/:id', authenticate, asyncHandler(async (req: Request, res) => {
  const person = await MissingPerson.findById(req.params.id);
  if (!person) throw new NotFoundError('Missing person not found');
  const isReporter = String(person.reportedBy) === req.user?.id;
  const isStaff = ['ADMIN'].includes(req.user?.role ?? '');
  if (!isReporter && !isStaff) throw new ForbiddenError('Not allowed to update this report');
  if (isReporter && person.status !== 'SEARCHING') throw new BadRequestError('Only searching cases can be edited by the reporter');
  const body = req.body as Record<string, unknown>;
  const allowed = ['fullName', 'age', 'gender', 'lastSeenLocation', 'lastSeenWard', 'district', 'description', 'contactPhone'];
  for (const key of allowed) if (body[key] !== undefined) (person as unknown as Record<string, unknown>)[key] = body[key];
  await person.save();
  sendSuccess(res, person.toJSON(), 'Missing person updated');
}));

export default router;
