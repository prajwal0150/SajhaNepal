import type { ResourceCategory, ResourcesData } from '../types/resourcesTypes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchResourcesThunk } from './resourcesThunk';

export interface ResourcesState {
  data: ResourcesData | null;
  loading: boolean;
  error: string | null;
  activeCategory: ResourceCategory | 'ALL';
}

const initialState: ResourcesState = {
  data: null,
  loading: false,
  error: null,
  activeCategory: 'ALL',
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResourcesCategory(state, action: PayloadAction<ResourceCategory | 'ALL'>) {
      state.activeCategory = action.payload;
    },
    clearResourcesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResourcesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResourcesThunk.fulfilled, (state, action: PayloadAction<ResourcesData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchResourcesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Failed to load resources';
      });
  },
});

export const { setResourcesCategory, clearResourcesError } = resourcesSlice.actions;
export default resourcesSlice.reducer;