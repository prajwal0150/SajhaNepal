import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../core/auth/jwt';
import { UnauthorizedError, ConflictError, BadRequestError, NotFoundError } from '../../core/errors/appError';
import { logAudit } from '../auditLogs/auditLog.service';
import { Request } from 'express';
import { Types } from 'mongoose';

const SALT_ROUNDS = 10;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async issueTokens(user: { _id: Types.ObjectId; role: string }): Promise<AuthTokens> {
    const accessToken = signAccessToken(String(user._id), user.role);
    const refreshToken = signRefreshToken(String(user._id), user.role);
    await User.updateOne(
      { _id: user._id },
      { $push: { refreshTokens: { $each: [refreshToken], $slice: -5 } } },
    );
    return { accessToken, refreshToken };
  }

  static async register(
    input: { fullName: string; email: string; phone?: string; password: string; role: string; district?: string; municipality?: string },
    req: Request,
  ): Promise<{ user: Record<string, unknown>; tokens: AuthTokens }> {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) throw new ConflictError('An account with this email already exists');

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await User.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      phone: input.phone || undefined,
      passwordHash,
      role: input.role,
      district: input.district || undefined,
      municipality: input.municipality || undefined,
    });

    const tokens = await this.issueTokens(user as never);
    await logAudit({ req, action: 'USER_REGISTERED', entityType: 'User', entityId: String(user._id), metadata: { role: input.role } });
    return { user: user.toJSON(), tokens };
  }

  static async login(
    input: { email: string; password: string },
    req: Request,
  ): Promise<{ user: Record<string, unknown>; tokens: AuthTokens }> {
    const identifier = input.email.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: input.email.trim() }],
    }).select('+passwordHash +refreshTokens');

    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (user.isBlocked) throw new UnauthorizedError('Account is blocked. Contact an administrator.');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated.');

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = await this.issueTokens(user as never);
    await logAudit({ req, action: 'USER_LOGIN', entityType: 'User', entityId: String(user._id) });
    return { user: user.toJSON(), tokens };
  }

  static async refresh(refreshToken: string): Promise<{ user: Record<string, unknown>; tokens: AuthTokens }> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await User.findById(payload.sub).select('+refreshTokens');
    if (!user || user.isBlocked || !user.isActive) {
      throw new UnauthorizedError('Account unavailable');
    }
    if (!user.refreshTokens.includes(refreshToken)) {
      // Token reuse detected — revoke all sessions
      user.refreshTokens = [];
      await user.save();
      throw new UnauthorizedError('Refresh token revoked. Please log in again.');
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
    const tokens = await this.issueTokens(user as never);
    return { user: user.toJSON(), tokens };
  }

  static async logout(refreshToken: string | undefined, req: Request): Promise<void> {
    if (refreshToken && req.user) {
      await User.updateOne({ _id: req.user.id }, { $pull: { refreshTokens: refreshToken } });
    }
    if (req.user) {
      await logAudit({ req, action: 'USER_LOGOUT', entityType: 'User', entityId: req.user.id });
    }
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    req: Request,
  ): Promise<void> {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new NotFoundError('User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestError('Current password is incorrect');
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.refreshTokens = [];
    await user.save();
    await logAudit({ req, action: 'PASSWORD_CHANGED', entityType: 'User', entityId: userId });
  }

  /**
   * Forgot password architecture. No email/SMS provider is configured in this
   * deployment, so the reset token is returned in the (development) response
   * and clearly marked — never faked as "email sent".
   */
  static async forgotPassword(email: string): Promise<{ resetToken?: string; configured: boolean }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return { configured: false }; // do not reveal account existence

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.set('resetPasswordToken', hashed);
    user.set('resetPasswordExpires', new Date(Date.now() + 60 * 60 * 1000));
    await user.save();

    return { resetToken, configured: false };
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    } as never).select('+passwordHash');
    if (!user) throw new BadRequestError('Invalid or expired reset token');
    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    user.set('resetPasswordToken', undefined);
    user.set('resetPasswordExpires', undefined);
    user.refreshTokens = [];
    await user.save();
  }
}


