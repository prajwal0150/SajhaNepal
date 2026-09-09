import type { AppNotification } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  items: AppNotification[];
  unread: number;
  loading: boolean;
}

const initialState: NotificationState = { items: [], unread: 0, loading: false };

export const fetchNotificationsThunk = createAsyncThunk('notifications/fetch', async () => {
  const { data } = await api.get<ApiEnvelope<AppNotification[]>>('/notifications', { params: { limit: 20 } });
  return data.data;
});

export const fetchUnreadCountThunk = createAsyncThunk('notifications/unread', async () => {
  const { data } = await api.get<ApiEnvelope<{ count: number }>>('/notifications/unread-count');
  return data.data.count;
});

export const markReadThunk = createAsyncThunk<string, string>('notifications/markRead', async (id) => {
  await api.patch(`/notifications/${id}/read`);
  return id;
});

export const markAllReadThunk = createAsyncThunk('notifications/markAll', async () => {
  await api.post('/notifications/read-all');
});

export const deleteNotificationThunk = createAsyncThunk<string, string>('notifications/delete', async (id) => {
  await api.delete(`/notifications/${id}`);
  return id;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationReceived(state, action: PayloadAction<AppNotification>) {
      state.items.unshift(action.payload);
      state.unread += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
        state.unread = action.payload;
      })
      .addCase(markReadThunk.fulfilled, (state, action) => {
        state.items = state.items.map((n) => (n._id === action.payload ? { ...n, isRead: true } : n));
        state.unread = Math.max(0, state.unread - 1);
      })
      .addCase(markAllReadThunk.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
        state.unread = 0;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        const removed = state.items.find((n) => n._id === action.payload);
        state.items = state.items.filter((n) => n._id !== action.payload);
        if (removed && !removed.isRead) state.unread = Math.max(0, state.unread - 1);
      });
  },
});

export const { notificationReceived } = notificationSlice.actions;
export default notificationSlice.reducer;
