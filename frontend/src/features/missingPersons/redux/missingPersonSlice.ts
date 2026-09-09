import type { RootState } from '@/store/Store';
import type { MissingPerson } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface MPState {
  items: MissingPerson[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  selected: MissingPerson | null;
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const initialState: MPState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  selected: null,
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
};

export const fetchMissingPersonsThunk = createAsyncThunk<
  { items: MissingPerson[]; meta: Record<string, unknown> },
  Record<string, unknown> | undefined,
  { rejectValue: string }
>('missingPersons/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ApiEnvelope<MissingPerson[]>>('/missing-persons', { params });
    return {
      items: data.data,
      meta: data.meta ?? { page: 1, limit: 20, total: data.data.length, totalPages: 1 },
    };
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const createMissingPersonThunk = createAsyncThunk<
  MissingPerson,
  Record<string, unknown>,
  { rejectValue: string }
>('missingPersons/create', async (payload, { rejectWithValue }) => {
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        if (v instanceof File) form.append(k, v);
        else form.append(k, String(v));
      }
    });
    const { data } = await api.post<ApiEnvelope<MissingPerson>>('/missing-persons', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const updateMissingPersonThunk = createAsyncThunk<
  MissingPerson,
  { id: string; payload: Record<string, unknown> },
  { rejectValue: string }
>('missingPersons/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<ApiEnvelope<MissingPerson>>(`/missing-persons/${id}`, payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

const missingPersonSlice = createSlice({
  name: 'missingPersons',
  initialState,
  reducers: {
    clearSelectedMP(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissingPersonsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissingPersonsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.meta = action.payload.meta as never;
      })
      .addCase(fetchMissingPersonsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load missing persons';
      })
      .addCase(createMissingPersonThunk.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createMissingPersonThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createMissingPersonThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Failed to create record';
      })
      .addCase(updateMissingPersonThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selected?._id === action.payload._id) state.selected = action.payload;
      });
  },
});

export const { clearSelectedMP } = missingPersonSlice.actions;
export default missingPersonSlice.reducer;

export const selectMissingPersons = (state: RootState) => state.missingPersons.items;
export const selectMissingPersonsLoading = (state: RootState) => state.missingPersons.loading;
export const selectMissingPersonsSubmitting = (state: RootState) => state.missingPersons.submitting;
export const selectMissingPersonsError = (state: RootState) => state.missingPersons.error;
export const selectMissingPersonSelected = (state: RootState) => state.missingPersons.selected;
export const selectMissingPersonsMeta = (state: RootState) => state.missingPersons.meta;
