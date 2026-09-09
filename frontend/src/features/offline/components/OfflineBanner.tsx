import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@shared/utils/format';
import { selectIsOnline, selectQueuedReports, removeQueued, setOnline } from '../redux/offlineSlice';
import { syncOfflineQueue, getQueuedReports, clearSyncedReports } from '../services/offlineQueue';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function OfflineBanner() {
  const dispatch = useDispatch<AppDispatch>();
  const online = useAppSelector(selectIsOnline);
  const queued = useAppSelector(selectQueuedReports);
  const queueCount = queued.length;

  useEffect(() => {
    const handleOnline = () => {
      dispatch(setOnline(true));
      syncOfflineQueue()
        .then(() => {
          clearSyncedReports();
          dispatch(setOnline(true));
        })
        .catch(() => {});
    };
    const handleOffline = () => dispatch(setOnline(false));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  if (online && queueCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[1100] flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium',
        online ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical',
      )}
    >
      <div className="flex items-center gap-2">
        {online ? <Wifi size={14} aria-hidden /> : <WifiOff size={14} aria-hidden />}
        {online
          ? `${queueCount} report(s) syncing…`
          : `You are offline — ${queueCount} report(s) queued`}
      </div>
      {online && queueCount > 0 && (
        <button
          onClick={() => {
            getQueuedReports().forEach((q) => {
              if (q.status === 'failed') dispatch(removeQueued(q.id));
            });
            dispatch(setOnline(true));
          }}
          className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
        >
          <RefreshCw size={12} aria-hidden /> {queueCount} pending
        </button>
      )}
    </div>
  );
}
