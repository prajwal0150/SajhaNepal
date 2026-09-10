import type { RootState } from '@/store/Store';

export const selectHowData = (state: RootState) => state.how?.data ?? null;
export const selectHowStats = (state: RootState) => state.how?.data?.stats ?? null;
export const selectHowSteps = (state: RootState) => state.how?.data?.steps ?? [];
export const selectHowRoles = (state: RootState) => state.how?.data?.roles ?? [];
export const selectHowVerifyPoints = (state: RootState) => state.how?.data?.verifyPoints ?? [];
export const selectHowLoading = (state: RootState) => state.how?.loading ?? false;
export const selectHowError = (state: RootState) => state.how?.error ?? null;
export const selectHowIsDemo = (state: RootState) => state.how?.data?.isDemo ?? true;