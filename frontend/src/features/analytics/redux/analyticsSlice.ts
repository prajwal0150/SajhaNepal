import type { RootState } from '@/store/Store';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AnalyticsState {
  overview: Record<string, unknown> | null;
  reports: Record<string, unknown> | null;
  performance: Record<string, unknown> | null;
  shelters: Record<string, unknown>[] | null;
  inventory: Record<string, unknown>[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  overview: null,
  reports: null,
  performance: null,
  shelters: null,
  inventory: null,
  loading: false,
  error: null,
};

export const fetchOverviewThunk = createAsyncThunk<Record<string, unknown>, void, { rejectValue: string }>(
  'analytics/overview',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/overview');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const fetchReportAnalyticsThunk = createAsyncThunk<Record<string, unknown>, void, { rejectValue: string }>(
  'analytics/reports',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/reports');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const fetchPerformanceThunk = createAsyncThunk<Record<string, unknown>, void, { rejectValue: string }>(
  'analytics/performance',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/performance');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load analytics';
      })
      .addCase(fetchReportAnalyticsThunk.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(fetchPerformanceThunk.fulfilled, (state, action) => {
        state.performance = action.payload;
      });
  },
});

export default analyticsSlice.reducer;

export const selectAnalyticsOverview = (state: RootState) => state.analytics.overview;
export const selectAnalyticsReports = (state: RootState) => state.analytics.reports;
export const selectAnalyticsPerformance = (state: RootState) => state.analytics.performance;
export const selectAnalyticsLoading = (state: RootState) => state.analytics.loading;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
