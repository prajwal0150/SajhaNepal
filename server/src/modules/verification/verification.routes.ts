import { Router } from 'express';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validateBody } from '../../core/middleware/validate';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';
import { ReportService } from '../reports/report.service';
import { verificationCreateSchema } from '../reports/report.validation';

const router = Router();

router.post('/', authenticate, authorize('VOLUNTEER', 'ADMIN'), validateBody(verificationCreateSchema), asyncHandler(async (req, res) => {
  const report = await ReportService.verifyReport(
    req.body.reportId,
    req.body.decision,
    req.body.notes,
    req.body.urgencyOverride,
    req,
  );
  sendSuccess(res, report, `Report ${req.body.decision.toLowerCase()} successfully`);
}));

router.get('/mine', authenticate, authorize('VOLUNTEER', 'ADMIN'), asyncHandler(async (req, res) => {
  const { items, meta } = await ReportService.getMyVerifications(req);
  sendSuccess(res, items, 'Verification history fetched', 200, meta);
}));

router.get('/', authenticate, authorize('VOLUNTEER', 'ADMIN', 'GOVERNMENT'), asyncHandler(async (req, res) => {
  const items = await ReportService.getVerificationsForReport(String(req.query.reportId));
  sendSuccess(res, items, 'Verifications fetched');
}));

export default router;
