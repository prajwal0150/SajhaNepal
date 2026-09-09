import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/format';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={ref}
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white p-5 animate-fade-up sm:rounded-xl',
          size === 'sm' && 'sm:max-w-sm',
          size === 'md' && 'sm:max-w-lg',
          size === 'lg' && 'sm:max-w-2xl',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1 text-muted hover:bg-ink/5 hover:text-ink">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-medium hover:bg-surface">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="h-10 rounded-lg bg-critical px-4 text-sm font-medium text-white hover:bg-critical/90 disabled:opacity-60"
        >
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
