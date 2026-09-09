import type { AuthState } from '../types/authTypes';
import { createSlice } from '@reduxjs/toolkit';
import { fetchMeThunk, loginThunk, logoutThunk, registerThunk } from './authThunk';

const initialState: AuthState = {
  user: null,
  status: 'idle',
  submitting: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    updateAuthUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(registerThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Registration failed';
      })
      .addCase(fetchMeThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
        state.initialized = true;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.user = null;
        state.status = 'idle';
        state.initialized = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { clearAuthError, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;

