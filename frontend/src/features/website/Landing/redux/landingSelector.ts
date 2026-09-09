import type { RootState } from '@/store/Store';

export const selectLandingData = (state: RootState) => state.landing?.data ?? null;
export const selectLandingStats = (state: RootState) => state.landing?.data?.stats ?? null;
export const selectLandingNeeds = (state: RootState) => state.landing?.data?.needs ?? [];
export const selectLandingShelters = (state: RootState) => state.landing?.data?.shelters ?? [];
export const selectLandingLoading = (state: RootState) => state.landing?.loading ?? false;
export const selectLandingError = (state: RootState) => state.landing?.error ?? null;
export const selectLandingFilters = (state: RootState) =>
  state.landing?.filters ?? { search: '', needType: '', urgency: '', district: '' };
export const selectLandingIsDemo = (state: RootState) => state.landing?.data?.isDemo ?? true;
