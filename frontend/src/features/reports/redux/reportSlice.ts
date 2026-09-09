import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Report } from '@shared/types';
import {
  fetchReportsThunk,
  fetchNearbyThunk,
  fetchReportByIdThunk,
  fetchMyReportsThunk,
  createReportThunk,
  cancelReportThunk,
} from './reportThunk';


export interface ReportState {
  items: Report[];
  nearby: Report[];
  selected: Report | null;
  myReports: Report[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  submitError: string | null;
  meta: { page: number; limit: number; total: number; totalPages: number };
  filters: { search: string; needType: string; urgency: string; district: string };
}

const initialMeta = { page: 1, limit: 20, total: 0, totalPages: 1 };

const initialState: ReportState = {
  items: [],
  nearby: [],
  selected: null,
  myReports: [],
  loading: false,
  submitting: false,
  error: null,
  submitError: null,
  meta: initialMeta,
  filters: { search: '', needType: '', urgency: '', district: '' },
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<ReportState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedReport(state) {
      state.selected = null;
    },
    reportUpdatedRealtime(state, action: PayloadAction<Report>) {
      const idx = state.items.findIndex((r) => r._id === action.payload._id);
      if (idx >= 0) state.items[idx] = action.payload;
      if (state.selected?._id === action.payload._id) state.selected = action.payload;
    },
    reportCreatedRealtime(state, action: PayloadAction<Report>) {
      if (!state.items.some((r) => r._id === action.payload._id)) {
        state.items.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchReportsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load reports';
      })
      .addCase(fetchNearbyThunk.fulfilled, (state, action) => {
        state.nearby = action.payload;
      })
      .addCase(fetchReportByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchReportByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load report';
      })
      .addCase(fetchMyReportsThunk.fulfilled, (state, action) => {
        state.myReports = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(createReportThunk.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(createReportThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createReportThunk.rejected, (state, action) => {
        state.submitting = false;
        if (action.payload) state.submitError = action.payload;
      })
      .addCase(cancelReportThunk.fulfilled, (state, action) => {
        state.myReports = state.myReports.map((r) => (r._id === action.payload._id ? action.payload : r));
      });
  },
});

export const { setFilters, clearSelectedReport, reportUpdatedRealtime, reportCreatedRealtime } = reportSlice.actions;
export default reportSlice.reducer;
