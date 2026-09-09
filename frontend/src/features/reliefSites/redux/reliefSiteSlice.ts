import type { RootState } from '@/store/Store';
import type { ReliefSite } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface RSState {
  items: ReliefSite[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  selected: ReliefSite | null;
}

const initialState: RSState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  selected: null,
};

export const fetchReliefSitesThunk = createAsyncThunk<ReliefSite[], Record<string, unknown> | undefined, { rejectValue: string }>(
  'reliefSites/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<ReliefSite[]>>('/relief-sites', { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const createReliefSiteThunk = createAsyncThunk<ReliefSite, Record<string, unknown>, { rejectValue: string }>(
  'reliefSites/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApiEnvelope<ReliefSite>>('/relief-sites', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

const reliefSiteSlice = createSlice({
  name: 'reliefSites',
  initialState,
  reducers: {
    setSelectedSite(state, action) {
      state.selected = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReliefSitesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReliefSitesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReliefSitesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load sites';
      })
      .addCase(createReliefSiteThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.submitting = false;
      })
      .addCase(createReliefSiteThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Failed to create site';
      });
  },
});

export const { setSelectedSite, clearError } = reliefSiteSlice.actions;
export default reliefSiteSlice.reducer;

export const selectReliefSites = (state: RootState) => state.reliefSites.items;
export const selectReliefSitesLoading = (state: RootState) => state.reliefSites.loading;
export const selectReliefSitesError = (state: RootState) => state.reliefSites.error;
export const selectReliefSiteSelected = (state: RootState) => state.reliefSites.selected;
