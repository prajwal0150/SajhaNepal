import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/Store';
import type { CreateReportPayload } from '@features/reports/services/reportService';
import { createReportRequest } from '@features/reports/services/reportService';
import { pushToast } from '@shared/redux/toastSlice';
import { setOnline, clearQueue } from '../redux/offlineSlice';

const STORE_KEY = 'sr_offline_queue';

export interface QueuedReport {
  id: string;
  payload: CreateReportPayload;
  status: 'queued' | 'syncing' | 'synced' | 'failed';
  error?: string;
  createdAt: number;
  attempts: number;
}

function readQueue(): QueuedReport[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: QueuedReport[]): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(items));
}

/** Queue a report payload when offline. Returns the queue id. */
export async function queueOfflineReport(payload: CreateReportPayload): Promise<string> {
    const id = crypto.randomUUID();
  const item: QueuedReport = {
    id,
    payload,
    status: 'queued',
    createdAt: Date.now(),
    attempts: 0,
  };
  const queue = readQueue();
  queue.push(item);
  writeQueue(queue);
  return id;
}

export function getQueuedReports(): QueuedReport[] {
  return readQueue();
}

export function clearSyncedReports(): void {
  const queue = readQueue().filter((q) => q.status !== 'synced');
  writeQueue(queue);
}

/** Drain the offline queue when connectivity is restored. */
export async function syncOfflineQueue(): Promise<void> {
  const queue = readQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    if (item.status === 'synced') continue;
    try {
      await createReportRequest(item.payload);
      item.status = 'synced';
      item.attempts += 1;
    } catch (err) {
      item.status = 'failed';
      item.error = err instanceof Error ? err.message : 'Sync failed';
      item.attempts += 1;
    }
  }
  writeQueue(queue);
}

/** React hook to manage offline networking + background sync. */
export function useOfflineSync() {
  const dispatch = useDispatch<AppDispatch>();

  if (typeof window === 'undefined') {
    return { online: true, queueCount: 0, sync: syncOfflineQueue };
  }

  const handleOnline = () => {
    dispatch(setOnline(true));
    syncOfflineQueue()
      .then(() => {
        const remaining = getQueuedReports().filter((q) => q.status === 'failed');
        if (remaining.length === 0) {
          clearSyncedReports();
          dispatch(clearQueue());
          pushToast({ kind: 'success', message: 'Offline reports synced successfully.' });
        }
      })
      .catch(() => {
        pushToast({ kind: 'error', message: 'Some offline reports failed to sync.' });
      });
  };

  const handleOffline = () => {
    dispatch(setOnline(false));
    pushToast({ kind: 'warning', message: 'You are now offline. Reports will be queued.' });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  return {
    online: navigator.onLine,
    queueCount: getQueuedReports().length,
    sync: syncOfflineQueue,
  };
}
