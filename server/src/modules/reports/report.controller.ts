import { Request, Response } from 'express';
import { ReportService } from './report.service';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files ?? {}) as { images?: Express.Multer.File[]; voice?: Express.Multer.File[] };
  const report = await ReportService.createReport(req.body, files, req);
  sendSuccess(res, report, 'Report submitted successfully', 201);
});

export const listReports = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await ReportService.listReports(req);
  sendSuccess(res, items, 'Reports fetched', 200, meta);
});

export const getNearbyReports = asyncHandler(async (req: Request, res: Response) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radiusKm ?? 25);
  const items = await ReportService.getNearbyReports(lat, lng, radiusKm, 200, {
    needType: req.query.needType as string | undefined,
    urgency: req.query.urgency as string | undefined,
  });
  sendSuccess(res, items, 'Nearby reports fetched');
});

export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportService.getReportById(req.params.id, req);
  sendSuccess(res, report, 'Report fetched');
});

export const getMyReports = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await ReportService.getMyReports(req);
  sendSuccess(res, items, 'My reports fetched', 200, meta);
});

export const updateReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportService.updateReport(req.params.id, req.body, req);
  sendSuccess(res, report, 'Report updated');
});

export const cancelReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await ReportService.cancelReport(req.params.id, req);
  sendSuccess(res, report, 'Report cancelled');
});
