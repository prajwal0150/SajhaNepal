import type { RootState } from '@/store/Store';
import type { Organization } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface OrgState {
  items: Organization[];
  myOrganizations: Organization[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  selected: Organization | null;
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const initialState: OrgState = {
  items: [],
  myOrganizations: [],
  loading: false,
  submitting: false,
  error: null,
  selected: null,
  meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
};

export const fetchOrganizationsThunk = createAsyncThunk<
  { items: Organization[]; meta: Record<string, unknown> },
  Record<string, string> | undefined,
  { rejectValue: string }
>('organizations/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ApiEnvelope<Organization[]>>('/organizations', { params });
    return { items: data.data, meta: data.meta ?? { page: 1, limit: 20, total: data.data.length, totalPages: 1 } };
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

export const fetchMyOrganizationsThunk = createAsyncThunk<Organization[], void, { rejectValue: string }>(
  'organizations/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Organization[]>>('/organizations/my');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const fetchOrganizationByIdThunk = createAsyncThunk<Organization, string, { rejectValue: string }>(
  'organizations/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Organization>>(`/organizations/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const createOrganizationThunk = createAsyncThunk<Organization, Record<string, unknown>, { rejectValue: string }>(
  'organizations/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApiEnvelope<Organization>>('/organizations', payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearSelectedOrg(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.meta = action.payload.meta as never;
      })
      .addCase(fetchOrganizationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load organizations';
      })
      .addCase(fetchMyOrganizationsThunk.fulfilled, (state, action) => {
        state.myOrganizations = action.payload;
      })
      .addCase(fetchOrganizationByIdThunk.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createOrganizationThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createOrganizationThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.myOrganizations.push(action.payload);
      })
      .addCase(createOrganizationThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Failed to create organization';
      });
  },
});

export const { clearSelectedOrg } = organizationSlice.actions;
export default organizationSlice.reducer;

export const selectOrganizations = (state: RootState) => state.organizations.items;
export const selectMyOrganizations = (state: RootState) => state.organizations.myOrganizations;
export const selectOrganizationSelected = (state: RootState) => state.organizations.selected;
export const selectOrganizationsLoading = (state: RootState) => state.organizations.loading;
export const selectOrganizationsSubmitting = (state: RootState) => state.organizations.submitting;
export const selectOrganizationsError = (state: RootState) => state.organizations.error;
