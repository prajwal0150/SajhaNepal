import type { RootState } from '@/store/Store';
import type { Report } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ClaimState {
  items: Report[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  claimError: string | null;
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const initialState: ClaimState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  claimError: null,
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
};

export const fetchAvailableClaimsThunk = createAsyncThunk<
  { items: Report[]; meta: Record<string, unknown> },
  Record<string, unknown> | undefined,
  { rejectValue: string }
>('claims/fetchAvailable', async (filters, { rejectWithValue }) => {
  try {
    const params = {
      status: 'VERIFIED',
      limit: filters?.limit ?? 20,
      page: filters?.page ?? 1,
      needType: filters?.needType ?? undefined,
      urgency: filters?.urgency ?? undefined,
      district: filters?.district ?? undefined,
    };
    const { data } = await api.get<ApiEnvelope<Report[]>>('/reports', { params });
    return {
      items: data.data.filter((r) => r.status === 'VERIFIED'),
      meta: data.meta ?? { page: 1, limit: 20, total: data.data.length, totalPages: 1 },
    };
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const claimReportThunk = createAsyncThunk<
  Report,
  { reportId: string; organizationId: string; notes?: string },
  { rejectValue: string }
>('claims/claim', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ApiEnvelope<Report>>('/claims', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const fetchMyClaimsThunk = createAsyncThunk<Report[], void, { rejectValue: string }>(
  'claims/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Report[]>>('/claims/mine');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const startOperationThunk = createAsyncThunk<Report, string, { rejectValue: string }>(
  'claims/startOperation',
  async (reportId, { rejectWithValue }) => {
    try {
            const { data } = await api.patch<ApiEnvelope<Report>>(`/claims/${reportId}/start`);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const releaseClaimThunk = createAsyncThunk<Report, string, { rejectValue: string }>(
  'claims/release',
  async (reportId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<ApiEnvelope<Report>>(`/claims/${reportId}/cancel`);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

const claimSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearClaimError(state) {
      state.claimError = null;
    },
    claimUpdatedRealtime(state, action) {
      const idx = state.items.findIndex((r) => r._id === action.payload._id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableClaimsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableClaimsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.meta = action.payload.meta as never;
      })
      .addCase(fetchAvailableClaimsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load claims';
      })
      .addCase(claimReportThunk.pending, (state) => {
        state.submitting = true;
        state.claimError = null;
      })
      .addCase(claimReportThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter((r) => r._id !== action.payload._id);
      })
      .addCase(claimReportThunk.rejected, (state, action) => {
        state.submitting = false;
        state.claimError = action.payload ?? 'Claim failed';
      })
      .addCase(fetchMyClaimsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(startOperationThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(releaseClaimThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload._id);
      });
  },
});

export const { clearClaimError, claimUpdatedRealtime } = claimSlice.actions;
export default claimSlice.reducer;

export const selectClaimsAvailable = (state: RootState) => state.claims.items;
export const selectClaimsLoading = (state: RootState) => state.claims.loading;
export const selectClaimsSubmitting = (state: RootState) => state.claims.submitting;
export const selectClaimsError = (state: RootState) => state.claims.error;
export const selectClaimError = (state: RootState) => state.claims.claimError;
export const selectClaimsMeta = (state: RootState) => state.claims.meta;
