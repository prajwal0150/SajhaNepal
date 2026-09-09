import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { CheckCircle2, AlertCircle, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '../utils/format';
import { selectToasts, dismissToast } from '../redux/toastSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: TriangleAlert,
};

const kindStyles: Record<string, string> = {
  success: 'bg-success text-white',
  error: 'bg-critical text-white',
  info: 'bg-primary text-white',
  warning: 'bg-warning text-white',
};

export function ToastHost() {
  const dispatch = useDispatch<AppDispatch>();
  const toasts = useAppSelector(selectToasts);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => setTimeout(() => dispatch(dismissToast(t.id)), 4200));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[1100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon = icons[t.kind];
        return (
          <div
            key={t.id}
            className={cn('pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-lg px-4 py-3 text-sm shadow-sm animate-fade-up', kindStyles[t.kind])}
            role="status"
          >
            <Icon size={16} className="shrink-0" aria-hidden />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dispatch(dismissToast(t.id))} aria-label="Dismiss" className="opacity-80 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
