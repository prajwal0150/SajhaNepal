import type { AuthTokens, LoginCredentials, RegisterPayload } from '../types/authTypes';
import type { AuthUser } from '@shared/types';
import { api, tokenStore, type ApiEnvelope } from '@shared/lib/axios';

export async function loginRequest(credentials: LoginCredentials): Promise<{ user: AuthUser } & AuthTokens> {
  const { data } = await api.post<ApiEnvelope<AuthUser & AuthTokens>>('/auth/login', credentials);
  tokenStore.set(data.data.accessToken, data.data.refreshToken);
  return { user: data.data, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
}

export async function registerRequest(payload: RegisterPayload): Promise<{ user: AuthUser } & AuthTokens> {
  const { data } = await api.post<ApiEnvelope<AuthUser & AuthTokens>>('/auth/register', payload);
  tokenStore.set(data.data.accessToken, data.data.refreshToken);
  return { user: data.data, accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<ApiEnvelope<AuthUser>>('/auth/me');
  return data.data;
}

export async function logoutRequest(): Promise<void> {
  const refresh = tokenStore.refresh;
  try {
    if (refresh) await api.post('/auth/logout', { refreshToken: refresh });
  } finally {
    tokenStore.clear();
  }
}

export async function forgotPasswordRequest(email: string): Promise<{ resetToken?: string; configured: boolean }> {
  const { data } = await api.post<ApiEnvelope<{ resetToken?: string; configured: boolean }>>('/auth/forgot-password', { email });
  return data.data;
}

export async function resetPasswordRequest(token: string, password: string): Promise<void> {
  await api.post('/auth/reset-password', { token, password });
}

export async function updateProfileRequest(payload: Partial<AuthUser>): Promise<AuthUser> {
  const { data } = await api.patch<ApiEnvelope<AuthUser>>('/auth/me', payload);
  return data.data;
}

