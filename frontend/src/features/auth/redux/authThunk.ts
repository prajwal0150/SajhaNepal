import type { RootState } from '@/store/Store';
import type { AuthTokens, LoginCredentials, RegisterPayload } from '../types/authTypes';
import type { AuthUser } from '@shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, registerRequest, fetchCurrentUser, logoutRequest } from '../services/authServices';

export const loginThunk = createAsyncThunk<{ user: AuthUser } & AuthTokens, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginRequest(credentials);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Login failed');
    }
  },
);

export const registerThunk = createAsyncThunk<{ user: AuthUser } & AuthTokens, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerRequest(payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Registration failed');
    }
  },
);

export const fetchMeThunk = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCurrentUser();
    } catch {
      return rejectWithValue('Session expired');
    }
  },
);

export const logoutThunk = createAsyncThunk<void, void, { state: RootState }>(
  'auth/logout',
  async () => {
    await logoutRequest();
  },
);
