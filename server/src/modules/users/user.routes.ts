import { Router } from 'express';
import { listUsers, listVolunteers, updateUser, getUserById } from './user.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { z } from 'zod';
import { validateBody } from '../../core/middleware/validate';

const updateSchema = z.object({
  role: z.enum(['CITIZEN', 'VOLUNTEER', 'NGO', 'GOVERNMENT', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
});

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'GOVERNMENT'), listUsers);
router.get('/volunteers', listVolunteers);
router.get('/:id', getUserById);
router.patch('/:id', authorize('ADMIN'), validateBody(updateSchema), updateUser);

export default router;
