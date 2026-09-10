import type { RootState } from '@/store/Store';

export const selectServicesData = (state: RootState) => state.services?.data ?? null;
export const selectServicesCategories = (state: RootState) => state.services?.data?.categories ?? [];
export const selectServicesList = (state: RootState) => state.services?.data?.services ?? [];
export const selectServicesStats = (state: RootState) => state.services?.data?.stats ?? null;
export const selectServicesLoading = (state: RootState) => state.services?.loading ?? false;
export const selectServicesError = (state: RootState) => state.services?.error ?? null;
export const selectServicesCategory = (state: RootState) => state.services?.activeCategory ?? 'ALL';
export const selectServicesIsDemo = (state: RootState) => state.services?.data?.isDemo ?? true;