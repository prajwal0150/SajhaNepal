import type { AuthUser } from '@shared/types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated';
  submitting: boolean;
  error: string | null;
  initialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  district?: string;
  municipality?: string;
}

