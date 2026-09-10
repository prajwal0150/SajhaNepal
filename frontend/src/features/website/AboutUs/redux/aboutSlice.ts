import type { AboutData } from '../types/aboutTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchAboutThunk } from './aboutThunk';

export interface AboutState {
  data: AboutData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  data: null,
  loading: false,
  error: null,
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearAboutError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutThunk.fulfilled, (state, action: PayloadAction<AboutData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAboutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load about content';
      });
  },
});

export const { clearAboutError } = aboutSlice.actions;
export default aboutSlice.reducer;