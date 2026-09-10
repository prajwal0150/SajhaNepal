import type { ServiceCategory, ServicesData } from '../types/servicesTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchServicesThunk } from './servicesThunk';

export interface ServicesState {
  data: ServicesData | null;
  loading: boolean;
  error: string | null;
  activeCategory: ServiceCategory | 'ALL';
}

const initialState: ServicesState = {
  data: null,
  loading: false,
  error: null,
  activeCategory: 'ALL',
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServicesCategory(state, action: PayloadAction<ServiceCategory | 'ALL'>) {
      state.activeCategory = action.payload;
    },
    clearServicesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesThunk.fulfilled, (state, action: PayloadAction<ServicesData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load services';
      });
  },
});

export const { setServicesCategory, clearServicesError } = servicesSlice.actions;
export default servicesSlice.reducer;