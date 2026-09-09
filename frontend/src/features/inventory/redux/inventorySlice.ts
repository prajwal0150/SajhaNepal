import type { RootState } from '@/store/Store';
import type { InventoryItem, InventoryTransaction } from '@shared/types';
import { api, type ApiEnvelope, extractApiError } from '@shared/lib/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface InventoryState {
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  transactions: [],
  loading: false,
  submitting: false,
  error: null,
};

export const fetchInventoryThunk = createAsyncThunk<InventoryItem[], void, { rejectValue: string }>(
  'inventory/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiEnvelope<InventoryItem[]>>('/inventory');
      return data.data;
    } catch (err) {
      return rejectWithValue(extractApiError(err));
    }
  },
);

export const addInventoryTransactionThunk = createAsyncThunk<
  InventoryTransaction,
  Record<string, unknown>,
  { rejectValue: string }
>('inventory/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ApiEnvelope<InventoryTransaction>>('/inventory/transactions', payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(extractApiError(err));
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load inventory';
      })
      .addCase(addInventoryTransactionThunk.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addInventoryTransactionThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(addInventoryTransactionThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Failed to add transaction';
      });
  },
});

export default inventorySlice.reducer;

export const selectInventoryItems = (state: RootState) => state.inventory.items;
export const selectInventoryTransactions = (state: RootState) => state.inventory.transactions;
export const selectInventoryLoading = (state: RootState) => state.inventory.loading;
export const selectInventorySubmitting = (state: RootState) => state.inventory.submitting;
export const selectInventoryError = (state: RootState) => state.inventory.error;
