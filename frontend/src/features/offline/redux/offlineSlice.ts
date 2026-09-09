import type { RootState } from '@/store/Store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SyncStatus = 'synced' | 'syncing' | 'failed' | 'queued' | 'offline';

export interface QueuedReport {
  id: string;
  payload: Record<string, unknown>;
  status: 'queued' | 'syncing' | 'synced' | 'failed';
  error?: string;
  createdAt: number;
  attempts: number;
}

interface OfflineState {
  online: boolean;
  queue: QueuedReport[];
}

const initialState: OfflineState = {
  online: navigator.onLine,
  queue: [],
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
    },
    queueReport(state, action: PayloadAction<QueuedReport>) {
      state.queue.push(action.payload);
    },
    updateQueuedStatus(
      state,
      action: PayloadAction<{ id: string; status: SyncStatus; error?: string }>,
    ) {
      const item = state.queue.find((q) => q.id === action.payload.id);
      if (item) {
        item.status = action.payload.status as QueuedReport['status'];
        if (action.payload.error) item.error = action.payload.error;
      }
    },
    removeQueued(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter((q) => q.id !== action.payload);
    },
    clearQueue(state) {
      state.queue = [];
    },
  },
});

export const {
  setOnline,
  queueReport,
  updateQueuedStatus,
  removeQueued,
  clearQueue,
} = offlineSlice.actions;

export default offlineSlice.reducer;

export const selectIsOnline = (state: RootState) => state.offline.online;
export const selectQueuedReports = (state: RootState) => state.offline.queue;
