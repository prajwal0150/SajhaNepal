import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? '';

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number } & Record<string, unknown>;
  errors?: string[];
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 20000,
});

// ---- Token storage --------------------------------------------------------
const ACCESS_KEY = 'sr_access';
const REFRESH_KEY = 'sr_refresh';

export const tokenStore = {
  get access(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Centralized 401 handling: single-flight refresh + request queue -------
let refreshPromise: Promise<string> | null = null;
let onAuthFailure: (() => void) | null = null;

export function setAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler;
}

async function refreshAccessToken(): Promise<string> {
  const refresh = tokenStore.refresh;
  if (!refresh) throw new Error('No refresh token');
  const response = await axios.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>(
    `${API_BASE}/auth/refresh`,
    { refreshToken: refresh },
  );
  const { accessToken, refreshToken } = response.data.data;
  tokenStore.set(accessToken, refreshToken);
  return accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const isAuthRoute = original?.url?.includes('/auth/refresh') || original?.url?.includes('/auth/login');

    if (error.response?.status === 401 && original && !original._retried && !isAuthRoute) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const newToken = await refreshPromise;
        refreshPromise = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        refreshPromise = null;
        tokenStore.clear();
        onAuthFailure?.();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiEnvelope<unknown> | undefined;
    if (data?.errors?.length) return data.errors.join(', ');
    if (data?.message) return data.message;
    if (error.code === 'ERR_NETWORK') return 'Network unavailable. You may be offline.';
    return error.message;
  }
  return error instanceof Error ? error.message : 'Unexpected error';
}
