import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { Report } from '@shared/types';
import { Card, StatusBadge, UrgencyBadge, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { Link } from 'react-router-dom';
import { fetchMyClaimsThunk } from '@features/claims/redux/claimSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function NgoClaimsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((s) => ({
    items: s.claims.items,
    loading: s.claims.loading,
    error: s.claims.error,
  }));

  useEffect(() => { dispatch(fetchMyClaimsThunk()); }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchMyClaimsThunk())} />;

  const activeClaims = items.filter((r: Report) => !['RESOLVED', 'CANCELLED'].includes(r.status));
  const completedClaims = items.filter((r: Report) => r.status === 'RESOLVED');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">My Claims</h1>
      <p className="text-sm text-muted mb-4">{activeClaims.length} active, {completedClaims.length} completed</p>

      {items.length === 0 ? (
        <EmptyState title="No claims" description="You haven't claimed any needs yet." />
      ) : (
        <div className="space-y-4">
          {items.map((r: Report) => (
            <Card key={r._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <p className="text-sm text-muted">{r.district}{r.ward ? ` · Ward ${r.ward}` : ''}</p>
                  <div className="mt-2 flex gap-2">
                    <UrgencyBadge urgency={r.urgency} />
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <Link to={`/reports/${r._id}`} className="text-sm text-primary underline">Manage</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
