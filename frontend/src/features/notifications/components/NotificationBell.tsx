import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { AppNotification } from '@shared/types';
import { Link } from 'react-router-dom';
import { cn, timeAgo } from '@shared/utils/format';
import {
  fetchNotificationsThunk,
  fetchUnreadCountThunk,
  markReadThunk,
  markAllReadThunk,
  notificationReceived,
} from '../redux/notificationSlice';
import { Bell, CheckCheck } from 'lucide-react';
import { onSocketEvent } from '@shared/lib/socket';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function NotificationBell() {
  const dispatch = useDispatch<AppDispatch>();
  const unread = useAppSelector((s) => s.notifications.unread);
  const items = useAppSelector((s) => s.notifications.items);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchUnreadCountThunk());
    const off = onSocketEvent('notification:new', (payload) => {
      dispatch(notificationReceived(payload as AppNotification));
    });
    return off;
  }, [dispatch]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) dispatch(fetchNotificationsThunk());
      return next;
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-ink/80 hover:bg-ink/5"
      >
        <Bell size={19} aria-hidden />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-80 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm animate-fade-up" role="menu" aria-label="Notification list">
          <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <button onClick={() => dispatch(markAllReadThunk())} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <CheckCheck size={13} aria-hidden /> Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted">No notifications yet</p>
            ) : (
              items.map((n) => (
                <div key={n._id} className={cn('border-b border-ink/5 px-3 py-2.5 last:border-0', !n.isRead && 'bg-primary/5')}>
                  <div className="flex items-start justify-between gap-2">
                    <button
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        if (!n.isRead) dispatch(markReadThunk(n._id));
                        if (n.entity?.kind === 'report' && n.entity.id) {
                          window.location.hash = `/reports/${n.entity.id}`;
                        }
                        setOpen(false);
                      }}
                    >
                      <p className={cn('truncate text-sm', n.isRead ? 'text-muted' : 'font-semibold text-ink')}>{n.title}</p>
                      <p className="line-clamp-2 text-xs text-muted">{n.message}</p>
                      <p className="mt-0.5 text-[11px] text-muted/70">{timeAgo(n.createdAt)}</p>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/notifications" onClick={() => setOpen(false)} className="block border-t border-ink/10 px-3 py-2 text-center text-sm font-medium text-primary hover:bg-surface">
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
