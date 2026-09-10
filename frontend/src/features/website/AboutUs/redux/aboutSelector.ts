import type { RootState } from '@/store/Store';

export const selectAboutData = (state: RootState) => state.about?.data ?? null;
export const selectAboutStats = (state: RootState) => state.about?.data?.stats ?? null;
export const selectAboutValues = (state: RootState) => state.about?.data?.values ?? [];
export const selectAboutMilestones = (state: RootState) => state.about?.data?.milestones ?? [];
export const selectAboutTeam = (state: RootState) => state.about?.data?.team ?? [];
export const selectAboutLoading = (state: RootState) => state.about?.loading ?? false;
export const selectAboutError = (state: RootState) => state.about?.error ?? null;
export const selectAboutIsDemo = (state: RootState) => state.about?.data?.isDemo ?? true;