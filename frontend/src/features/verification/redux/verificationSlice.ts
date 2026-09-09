import type { RootState } from '@/store/Store';
import type { Verification } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface VerificationState {
  items: Verification[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const initialState: VerificationState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
};

export const fetchPendingReportsThunk = createAsyncThunk<
  { items: Record<string, unknown>[]; meta: Record<string, unknown> },
  void,
  { rejectValue: string }
>('verification/fetchPending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/reports', {
      params: { status: 'PENDING', limit: 50 },
    });
    const meta = data.meta ?? { page: 1, limit: 50, total: data.data.length, totalPages: 1 };
    return { items: data.data, meta };
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const verifyReportThunk = createAsyncThunk<
  Record<string, unknown>,
  { reportId: string; decision: 'VERIFIED' | 'REJECTED' | 'FLAGGED'; notes?: string; urgencyOverride?: string },
  { rejectValue: string }
>('verification/verify', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ApiEnvelope<Record<string, unknown>>>('/verifications', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const fetchMyVerificationsThunk = createAsyncThunk<
  Verification[],
  void,
  { rejectValue: string }
>('verification/my', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ApiEnvelope<Verification[]>>('/verifications/mine');
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearVerificationError(state) {
      state.error = null;
    },
    verificationReceived(state, action: PayloadAction<Record<string, unknown>>) {
      state.items.unshift(action.payload as any);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingReportsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingReportsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items as unknown as Verification[];
        state.meta = action.payload.meta as never;
      })
      .addCase(fetchPendingReportsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load pending reports';
      })
      .addCase(verifyReportThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(verifyReportThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter((r) => {
          const payload = action.payload as { _id?: string };
          return payload._id !== (r as Record<string, unknown>)._id;
        });
      })
      .addCase(verifyReportThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Verification failed';
      })
      .addCase(fetchMyVerificationsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearVerificationError, verificationReceived } = verificationSlice.actions;
export default verificationSlice.reducer;

export const selectVerificationItems = (state: RootState) => state.verification.items;
export const selectVerificationLoading = (state: RootState) => state.verification.loading;
export const selectVerificationSubmitting = (state: RootState) => state.verification.submitting;
export const selectVerificationError = (state: RootState) => state.verification.error;
