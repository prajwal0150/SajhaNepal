import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name is too short').max(120),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone is too short').max(20).optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['CITIZEN', 'VOLUNTEER', 'NGO', 'GOVERNMENT']).default('CITIZEN'),
  district: z.string().max(60).optional().default(''),
  municipality: z.string().max(80).optional().default(''),
});

export const loginSchema = z.object({
  email: z.string().min(3, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token required'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().max(500).optional(),
  address: z.string().max(300).optional(),
  province: z.string().max(60).optional(),
  district: z.string().max(60).optional(),
  municipality: z.string().max(80).optional(),
  ward: z.coerce.number().int().min(1).max(35).optional(),
  language: z.enum(['en', 'ne']).optional(),
});
