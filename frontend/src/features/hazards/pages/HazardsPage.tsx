import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { Hazard } from '@shared/types';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { fetchHazardsThunk } from '@features/hazards/redux/hazardSlice';
import { formatDate } from '@shared/utils/format';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function HazardsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((s) => ({
    items: s.hazards.items,
    loading: s.hazards.loading,
    error: s.hazards.error,
  }));

  useEffect(() => { dispatch(fetchHazardsThunk()); }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchHazardsThunk())} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-6">Hazard Alerts</h1>
      {items.length === 0 ? (
        <EmptyState title="No active hazards" description="No current hazard alerts." />
      ) : (
        <div className="space-y-4">
          {items.map((h: Hazard) => (
            <Card key={h._id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{h.title}</h3>
                  <p className="text-sm text-muted">{h.description}</p>
                  <p className="text-xs text-muted">District: {h.district ?? '—'} · Severity: {h.severity}</p>
                  <p className="text-xs text-muted">{formatDate((h as unknown as Record<string, unknown>).createdAt as string)}</p>
                </div>
                <span className={`text-xs font-medium ${h.status === 'ACTIVE' ? 'text-critical' : h.status === 'EXPIRED' ? 'text-muted' : 'text-success'}`}>{h.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
