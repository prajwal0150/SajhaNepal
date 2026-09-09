import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { sendSuccess } from '../../core/utils/helpers';
import { User } from '../users/user.model';
import { UnauthorizedError } from '../../core/errors/appError';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await AuthService.register(req.body, req);
  sendSuccess(res, { user, ...tokens }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await AuthService.login(req.body, req);
  sendSuccess(res, { user, ...tokens }, 'Login successful');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await AuthService.refresh(req.body.refreshToken);
  sendSuccess(res, { user, ...tokens }, 'Token refreshed');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.logout(req.body?.refreshToken, req);
  sendSuccess(res, null, 'Logged out');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await User.findById(req.user.id);
  if (!user) throw new UnauthorizedError('Account not found');
  sendSuccess(res, user.toJSON(), 'Current user');
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const user = await User.findById(req.user.id);
  if (!user) throw new UnauthorizedError('Account not found');
  Object.assign(user, req.body);
  await user.save();
  sendSuccess(res, user.toJSON(), 'Profile updated');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword, req);
  sendSuccess(res, null, 'Password changed. Please log in again.');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body.email);
  sendSuccess(res, result, result.resetToken
    ? 'Reset token generated (development mode — no email provider configured)'
    : 'If the account exists, a reset token has been generated');
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, null, 'Password reset successful');
});
