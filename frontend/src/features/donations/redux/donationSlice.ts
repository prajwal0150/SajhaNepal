import type { RootState } from '@/store/Store';
import type { Donation } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface DonationState {
  items: Donation[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  totalNPR: number;
}

const initialState: DonationState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  totalNPR: 0,
};

export const fetchDonationsThunk = createAsyncThunk<Donation[], void, { rejectValue: string }>(
  'donations/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Donation[]>>('/donations');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const createDonationThunk = createAsyncThunk<Donation, Record<string, unknown>, { rejectValue: string }>(
  'donations/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApiEnvelope<Donation>>('/donations', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalNPR = action.payload.reduce((sum, d) => sum + (d.amountNPR ?? 0), 0);
      })
      .addCase(fetchDonationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load donations';
      })
      .addCase(createDonationThunk.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createDonationThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
        state.totalNPR += action.payload.amountNPR ?? 0;
      })
      .addCase(createDonationThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Failed to create donation';
      });
  },
});

export default donationSlice.reducer;

export const selectDonations = (state: RootState) => state.donations.items;
export const selectDonationsLoading = (state: RootState) => state.donations.loading;
export const selectDonationsSubmitting = (state: RootState) => state.donations.submitting;
export const selectDonationsError = (state: RootState) => state.donations.error;
export const selectDonationsTotal = (state: RootState) => state.donations.totalNPR;
