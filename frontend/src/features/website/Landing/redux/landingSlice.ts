import type { LandingData, LandingFilters } from '../types/landingTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchLandingThunk } from './landingThunk';

export interface LandingState {
  data: LandingData | null;
  loading: boolean;
  error: string | null;
  filters: LandingFilters;
}

const initialState: LandingState = {
  data: null,
  loading: false,
  error: null,
  filters: { search: '', needType: '', urgency: '', district: '' },
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    setLandingFilters(state, action: PayloadAction<Partial<LandingFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearLandingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingThunk.fulfilled, (state, action: PayloadAction<LandingData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLandingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load landing data';
      });
  },
});

export const { setLandingFilters, clearLandingError } = landingSlice.actions;
export default landingSlice.reducer;

