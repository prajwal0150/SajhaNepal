import { Router } from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../../core/middleware/auth';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';
import { AnalyticsService } from './analytics.service';
import { MissingPerson } from '../missingPersons/missingPerson.model';

const router = Router();

router.get('/overview', optionalAuthenticate, asyncHandler(async (req, res) => {
  const data = await AnalyticsService.overview(req);
  sendSuccess(res, data, 'Analytics overview');
}));

router.get('/reports', authenticate, authorize('GOVERNMENT', 'ADMIN', 'NGO'), asyncHandler(async (_req, res) => {
  const data = await AnalyticsService.reportAnalytics();
  sendSuccess(res, data, 'Report analytics');
}));

router.get('/performance', authenticate, authorize('GOVERNMENT', 'ADMIN'), asyncHandler(async (_req, res) => {
  const data = await AnalyticsService.performance();
  sendSuccess(res, data, 'Performance analytics');
}));

router.get('/shelters', authenticate, authorize('GOVERNMENT', 'ADMIN', 'NGO'), asyncHandler(async (_req, res) => {
  const data = await AnalyticsService.shelterAnalytics();
  sendSuccess(res, data, 'Shelter analytics');
}));

router.get('/inventory-usage', authenticate, authorize('GOVERNMENT', 'ADMIN', 'NGO'), asyncHandler(async (_req, res) => {
  const data = await AnalyticsService.inventoryUsage();
  sendSuccess(res, data, 'Inventory usage');
}));

router.get('/missing-persons', authenticate, authorize('GOVERNMENT', 'ADMIN'), asyncHandler(async (_req, res) => {
  const byStatus = await MissingPerson.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const total = await MissingPerson.countDocuments({});
  sendSuccess(res, { total, byStatus }, 'Missing persons analytics');
}));

export default router;
