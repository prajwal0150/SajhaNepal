import type { HowData } from '../types/howTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchHowThunk } from './howThunk';

export interface HowState {
  data: HowData | null;
  loading: boolean;
  error: string | null;
}

const initialState: HowState = {
  data: null,
  loading: false,
  error: null,
};

const howSlice = createSlice({
  name: 'how',
  initialState,
  reducers: {
    clearHowError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHowThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHowThunk.fulfilled, (state, action: PayloadAction<HowData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHowThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load how-it-works content';
      });
  },
});

export const { clearHowError } = howSlice.actions;
export default howSlice.reducer;