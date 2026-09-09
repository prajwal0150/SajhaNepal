import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  me,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
} from './auth.controller';
import { authenticate } from '../../core/middleware/auth';
import { validateBody } from '../../core/middleware/validate';
import { authLimiter } from '../../core/middleware/rateLimit';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.validation';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);
router.post('/logout', authenticate, validateBody(logoutSchema), logout);
router.get('/me', authenticate, me);
router.patch('/me', authenticate, validateBody(updateProfileSchema), updateMe);
router.post('/change-password', authenticate, validateBody(changePasswordSchema), changePassword);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

export default router;
