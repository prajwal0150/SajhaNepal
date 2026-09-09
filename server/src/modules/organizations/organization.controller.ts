import { Request, Response } from 'express';
import { Organization } from './organization.model';
import { User } from '../users/user.model';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess, getPagination, buildPaginationMeta, escapeRegex } from '../../core/utils/helpers';
import { NotFoundError, ForbiddenError, ConflictError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';
import { createNotification } from '../notifications/notification.service';
import { emitEvent } from '../../sockets';
import { Types } from 'mongoose';

export const listOrganizations = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const filter: Record<string, unknown> = {};
  // Public can only see verified organizations
  if (req.user?.role === 'ADMIN' || req.user?.role === 'GOVERNMENT') {
    if (req.query.verificationStatus) filter.verificationStatus = req.query.verificationStatus;
  } else {
    filter.verificationStatus = 'VERIFIED';
  }
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(String(req.query.search)), 'i');
    filter.$or = [{ name: rx }, { description: rx }];
  }
  if (req.query.type) filter.type = req.query.type;
  if (req.query.district) filter.district = new RegExp(escapeRegex(String(req.query.district)), 'i');

  const [items, total] = await Promise.all([
    Organization.find(filter).sort({ trustScore: -1, createdAt: -1 }).skip(skip).limit(limit)
      .populate('members.user', 'fullName avatar'),
    Organization.countDocuments(filter),
  ]);
  sendSuccess(res, items.map((o) => o.toJSON()), 'Organizations fetched', 200, buildPaginationMeta(total, page, limit));
});

export const getOrganization = asyncHandler(async (req: Request, res: Response) => {
  const org = await Organization.findById(req.params.id).populate('members.user', 'fullName avatar role');
  if (!org) throw new NotFoundError('Organization not found');
  sendSuccess(res, org.toJSON(), 'Organization fetched');
});

export const getMyOrganizations = asyncHandler(async (req: Request, res: Response) => {
  const items = await Organization.find({ 'members.user': req.user?.id }).populate('members.user', 'fullName avatar role');
  sendSuccess(res, items.map((o) => o.toJSON()), 'My organizations fetched');
});

export const createOrganization = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Organization.findOne({ name: req.body.name });
  if (existing) throw new ConflictError('An organization with this name already exists');

  const org = await Organization.create({
    ...req.body,
    verificationStatus: 'PENDING',
    members: [{ user: req.user?.id, roleInOrg: 'ADMIN' }],
  });
  await User.updateOne({ _id: req.user?.id }, { role: 'NGO' });
  await logAudit({ req, action: 'ORGANIZATION_CREATED', entityType: 'Organization', entityId: String(org._id) });
  sendSuccess(res, org.toJSON(), 'Organization created. Pending admin verification.', 201);
});

export const updateOrganization = asyncHandler(async (req: Request, res: Response) => {
  const org = await Organization.findById(req.params.id);
  if (!org) throw new NotFoundError('Organization not found');

  const isOrgAdmin = org.members.some((m) => String(m.user) === req.user?.id && m.roleInOrg === 'ADMIN');
  if (!isOrgAdmin && req.user?.role !== 'ADMIN') throw new ForbiddenError('Only organization admins can update');

  const allowed = ['description', 'email', 'phone', 'logo', 'address', 'province', 'district', 'municipality', 'ward', 'location'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) (org as unknown as Record<string, unknown>)[key] = req.body[key];
  }
  await org.save();
  sendSuccess(res, org.toJSON(), 'Organization updated');
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const org = await Organization.findById(req.params.id);
  if (!org) throw new NotFoundError('Organization not found');
  const isOrgAdmin = org.members.some((m) => String(m.user) === req.user?.id && m.roleInOrg === 'ADMIN');
  if (!isOrgAdmin && req.user?.role !== 'ADMIN') throw new ForbiddenError('Only organization admins can add members');

  const member = await User.findById(req.body.userId);
  if (!member) throw new NotFoundError('User not found');
  if (org.members.some((m) => String(m.user) === req.body.userId)) {
    throw new ConflictError('User is already a member');
  }
  org.members.push({ user: member._id as Types.ObjectId, roleInOrg: req.body.roleInOrg ?? 'MEMBER' });
  await org.save();
  await User.updateOne({ _id: member._id }, { role: 'NGO' });
  sendSuccess(res, org.toJSON(), 'Member added');
});

export const verifyOrganization = asyncHandler(async (req: Request, res: Response) => {
  const org = await Organization.findById(req.params.id);
  if (!org) throw new NotFoundError('Organization not found');
  org.verificationStatus = req.body.verificationStatus ?? 'VERIFIED';
  org.set('verifiedBy', req.user?.id);
  org.verifiedAt = new Date();
  await org.save();

  await logAudit({ req, action: 'ORGANIZATION_VERIFIED', entityType: 'Organization', entityId: String(org._id), metadata: { status: org.verificationStatus } });

  const admins = org.members.filter((m) => m.roleInOrg === 'ADMIN');
  await Promise.all(
    admins.map((m) =>
      createNotification({
        userId: String(m.user),
        type: 'ORGANIZATION_APPROVED',
        title: 'Organization verified',
        message: `${org.name} is now verified on Saajha Rahat`,
        entity: { kind: 'organization', id: String(org._id) },
      }),
    ),
  );

  emitEvent('report:updated', { scope: 'organizations' });
  sendSuccess(res, org.toJSON(), 'Organization verification updated');
});

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const org = await Organization.findById(req.params.id).populate('members.user', 'fullName avatar role district lastLoginAt');
  if (!org) throw new NotFoundError('Organization not found');
  sendSuccess(res, org.members, 'Members fetched');
});

