import type { RootState } from '@/store/Store';

export const selectReports = (state: RootState) => state.reports.items;
export const selectNearbyReports = (state: RootState) => state.reports.nearby;
export const selectSelectedReport = (state: RootState) => state.reports.selected;
export const selectMyReports = (state: RootState) => state.reports.myReports;
export const selectReportsLoading = (state: RootState) => state.reports.loading;
export const selectReportsSubmitting = (state: RootState) => state.reports.submitting;
export const selectReportsError = (state: RootState) => state.reports.error;
export const selectReportFilters = (state: RootState) => state.reports.filters;
export const selectReportsMeta = (state: RootState) => state.reports.meta;