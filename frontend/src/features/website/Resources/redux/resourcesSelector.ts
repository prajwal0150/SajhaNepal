import type { RootState } from '@/store/Store';

export const selectResourcesData = (state: RootState) => state.resources?.data ?? null;
export const selectResourcesCategories = (state: RootState) => state.resources?.data?.categories ?? [];
export const selectResourcesList = (state: RootState) => state.resources?.data?.resources ?? [];
export const selectResourcesStats = (state: RootState) => state.resources?.data?.stats ?? null;
export const selectResourcesLoading = (state: RootState) => state.resources?.loading ?? false;
export const selectResourcesError = (state: RootState) => state.resources?.error ?? null;
export const selectResourcesCategory = (state: RootState) => state.resources?.activeCategory ?? 'ALL';
export const selectResourcesIsDemo = (state: RootState) => state.resources?.data?.isDemo ?? true;