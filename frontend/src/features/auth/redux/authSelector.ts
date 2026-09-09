import type { RootState } from '@/store/Store';

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectAuthRole = (state: RootState) => state.auth.user?.role ?? null;
export const selectAuthSubmitting = (state: RootState) => state.auth.submitting;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;
