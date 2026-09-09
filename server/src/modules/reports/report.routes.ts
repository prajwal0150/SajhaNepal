import { Router } from 'express';
import {
  createReport,
  listReports,
  getNearbyReports,
  getReportById,
  getMyReports,
  updateReport,
  cancelReport,
} from './report.controller';
import { authenticate, authorize, optionalAuthenticate } from '../../core/middleware/auth';
import { validateBody, validateQuery } from '../../core/middleware/validate';
import { uploadMedia } from '../../core/middleware/upload';
import { createLimiter } from '../../core/middleware/rateLimit';
import { reportCreateSchema, reportListQuerySchema, reportUpdateSchema } from './report.validation';

const router = Router();

router.get('/', optionalAuthenticate, validateQuery(reportListQuerySchema), listReports);
router.get('/mine', authenticate, getMyReports);
router.get('/nearby', getNearbyReports);

router.post(
  '/',
  optionalAuthenticate,
  createLimiter,
  uploadMedia.fields([
    { name: 'images', maxCount: 5 },
    { name: 'voice', maxCount: 1 },
  ]),
  validateBody(reportCreateSchema),
  createReport,
);

router.get('/:id', optionalAuthenticate, getReportById);

router.patch('/:id', authenticate, authorize('ADMIN'), validateBody(reportUpdateSchema), updateReport);
router.patch('/:id/cancel', authenticate, cancelReport);

export default router;
