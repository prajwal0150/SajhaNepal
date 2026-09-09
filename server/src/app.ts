import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { env } from './config/environment';
import { apiLimiter } from './core/middleware/rateLimit';
import { notFoundHandler, errorHandler } from './core/middleware/errorHandler';
import { httpLogger } from './core/logger/logger';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import organizationRoutes from './modules/organizations/organization.routes';
import reportRoutes from './modules/reports/report.routes';
import verificationRoutes from './modules/verification/verification.routes';
import claimRoutes from './modules/claims/claim.routes';
import deliveryRoutes from './modules/deliveries/delivery.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import missingPersonRoutes from './modules/missingPersons/missingPerson.routes';
import reliefSiteRoutes from './modules/reliefSites/reliefSite.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import donationRoutes from './modules/donations/donation.routes';
import hazardRoutes from './modules/hazards/hazard.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import adminRoutes from './modules/admin/admin.routes';
import integrationRoutes from './integrations';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(httpLogger);

  // Development static file storage fallback (used when Cloudinary is not configured)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), { maxAge: '1d' }));

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Saajha Rahat API is running', data: { env: env.NODE_ENV, time: new Date().toISOString() } });
  });

  app.use('/api/v1', apiLimiter);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/organizations', organizationRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/verifications', verificationRoutes);
  app.use('/api/v1/claims', claimRoutes);
  app.use('/api/v1/deliveries', deliveryRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/missing-persons', missingPersonRoutes);
  app.use('/api/v1/relief-sites', reliefSiteRoutes);
  app.use('/api/v1/inventory', inventoryRoutes);
  app.use('/api/v1/donations', donationRoutes);
  app.use('/api/v1/hazards', hazardRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/integrations', integrationRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
