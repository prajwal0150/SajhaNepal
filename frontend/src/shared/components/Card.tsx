import type { ReportStatus, Urgency } from '../types';
import { STATUS_META, URGENCY_META } from '../constants';
import { cn } from '../utils/format';

export function Card({ children, className, as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return <Tag className={cn('rounded-lg border border-ink/10 bg-white', className)}>{children}</Tag>;
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <Badge className={STATUS_META[status]?.classes ?? 'bg-muted/10 text-muted border-muted/30'}>{status.replace('_', ' ')}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <Badge className={URGENCY_META[urgency]?.classes}>
      <span className={cn('h-1.5 w-1.5 rounded-full', URGENCY_META[urgency]?.dot)} aria-hidden />
      {urgency}
    </Badge>
  );
}

export function StatCard({ label, value, icon, accent = 'bg-primary/10 text-primary', hint }: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
  hint?: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      {icon && <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', accent)} aria-hidden>{icon}</div>}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="text-xl font-semibold text-ink">{value}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
    </Card>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink/15 bg-white px-6 py-12 text-center">
      {icon && <div className="mb-3 text-muted" aria-hidden>{icon}</div>}
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-critical/30 bg-critical/5 px-4 py-6 text-center">
      <p className="text-sm font-medium text-critical">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-medium text-primary underline-offset-2 hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-ink/10', className)} aria-hidden />;
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}
