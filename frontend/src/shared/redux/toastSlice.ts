import type { RootState } from '@/store/Store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ToastItem {
  id: number;
  kind: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
}

const initialState: ToastState = { toasts: [] };

let nextId = 1;

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushToast(state, action: PayloadAction<{ kind: ToastItem['kind']; message: string }>) {
      state.toasts.push({ id: nextId++, ...action.payload });
      if (state.toasts.length > 5) state.toasts.shift();
    },
    dismissToast(state, action: PayloadAction<number>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { pushToast, dismissToast } = toastSlice.actions;
export default toastSlice.reducer;

export const selectToasts = (state: RootState) => state.toast.toasts;
