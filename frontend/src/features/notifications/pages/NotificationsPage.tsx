import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { AppNotification } from '@shared/types';
import { Bell, Check } from 'lucide-react';
import { Button } from '@shared/components/Button';
import { Card, LoadingSkeleton, EmptyState } from '@shared/components/Card';
import { fetchNotificationsThunk, markAllReadThunk } from '@features/notifications/redux/notificationSlice';
import { formatDate } from '@shared/utils/format';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, unread } = useAppSelector((s) => ({
    items: s.notifications.items,
    loading: s.notifications.loading,
    unread: s.notifications.unread,
  }));

  useEffect(() => { dispatch(fetchNotificationsThunk()); }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={8} />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Notifications</h1>
        {unread > 0 && (
          <Button size="sm" variant="ghost" onClick={() => dispatch(markAllReadThunk())}>
            <Check size={16} className="mr-1" /> Mark all read
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up!" icon={<Bell size={24} />} />
      ) : (
        <div className="space-y-3">
          {items.map((n: AppNotification) => (
            <Card key={n._id} className={`p-4 ${!n.isRead ? 'border-l-4 border-primary' : ''}`}>
              <div className="flex justify-between">
                <p className={n.isRead ? 'text-muted' : 'text-ink'}>{n.message}</p>
                <span className="text-xs text-muted">{formatDate(n.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
