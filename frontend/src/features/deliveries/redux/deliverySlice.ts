import type { RootState } from '@/store/Store';
import type { Delivery } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface DeliveryState {
  items: Delivery[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  selected: Delivery | null;
}

const initialState: DeliveryState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  selected: null,
};

export const fetchMyDeliveriesThunk = createAsyncThunk<Delivery[], void, { rejectValue: string }>(
  'deliveries/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<Delivery[]>>('/deliveries/mine');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const createDeliveryThunk = createAsyncThunk<
  { delivery: Delivery; report: Record<string, unknown> },
  {
    reportId: string;
    organizationId: string;
    quantityDelivered: number;
    recipientCount?: number;
    notes?: string;
    proofImages?: File[];
  },
  { rejectValue: string }
>('deliveries/create', async (payload, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append('reportId', payload.reportId);
    form.append('organizationId', payload.organizationId);
    form.append('quantityDelivered', String(payload.quantityDelivered));
    if (payload.recipientCount !== undefined) form.append('recipientCount', String(payload.recipientCount));
    if (payload.notes) form.append('notes', payload.notes);
    payload.proofImages?.forEach((f) => form.append('proofImages', f));
    const { data } = await api.post<ApiEnvelope<{ delivery: Delivery; report: Record<string, unknown> }>>(
      '/deliveries',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

const deliverySlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    clearDeliveryError(state) {
      state.error = null;
    },
    setSelectedDelivery(state, action) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyDeliveriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDeliveriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyDeliveriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load deliveries';
      })
      .addCase(createDeliveryThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createDeliveryThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload.delivery);
      })
      .addCase(createDeliveryThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Failed to record delivery';
      });
  },
});

export const { clearDeliveryError, setSelectedDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;

export const selectDeliveries = (state: RootState) => state.deliveries.items;
export const selectDeliveriesLoading = (state: RootState) => state.deliveries.loading;
export const selectDeliveriesSubmitting = (state: RootState) => state.deliveries.submitting;
export const selectDeliveriesError = (state: RootState) => state.deliveries.error;
export const selectSelectedDelivery = (state: RootState) => state.deliveries.selected;
