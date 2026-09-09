import { Router } from 'express';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validateBody } from '../../core/middleware/validate';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';
import { ClaimService } from './claim.service';
import { claimCreateSchema } from '../reports/report.validation';

const router = Router();

router.post('/', authenticate, authorize('NGO'), validateBody(claimCreateSchema), asyncHandler(async (req, res) => {
  const report = await ClaimService.claimReport(
    req.body.reportId,
    req.body.organizationId,
    req.user!.id,
    req.body.notes,
    req,
  );
  sendSuccess(res, report, 'Need claimed successfully', 201);
}));

router.get('/mine', authenticate, authorize('NGO'), asyncHandler(async (req, res) => {
  const items = await ClaimService.getMyClaims(req);
  sendSuccess(res, items, 'My claims fetched');
}));

router.patch('/:id/start', authenticate, authorize('NGO'), asyncHandler(async (req, res) => {
  const report = await ClaimService.startOperation(req.params.id, req.user!.id, req);
  sendSuccess(res, report, 'Operation started');
}));

router.patch('/:id/cancel', authenticate, authorize('NGO'), asyncHandler(async (req, res) => {
  const report = await ClaimService.releaseClaim(req.params.id, req.user!.id, req);
  sendSuccess(res, report, 'Claim released');
}));

export default router;
