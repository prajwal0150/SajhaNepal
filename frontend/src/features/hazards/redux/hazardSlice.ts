import type { RootState } from '@/store/Store';
import type { Hazard } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface HazardState {
  items: Hazard[];
  loading: boolean;
  error: string | null;
  selected: Hazard | null;
}

const initialState: HazardState = {
  items: [],
  loading: false,
  error: null,
  selected: null,
};

export const fetchHazardsThunk = createAsyncThunk<Hazard[], void, { rejectValue: string }>(
  'hazards/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Hazard[]>>('/hazards');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

const hazardSlice = createSlice({
  name: 'hazards',
  initialState,
  reducers: {
    setSelectedHazard(state, action) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHazardsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHazardsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHazardsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load hazards';
      });
  },
});

export const { setSelectedHazard } = hazardSlice.actions;
export default hazardSlice.reducer;

export const selectHazards = (state: RootState) => state.hazards.items;
export const selectHazardsLoading = (state: RootState) => state.hazards.loading;
export const selectHazardsError = (state: RootState) => state.hazards.error;
export const selectHazardSelected = (state: RootState) => state.hazards.selected;
