import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { Button } from '@shared/components/Button';
import { Card, LoadingSkeleton, ErrorState, EmptyState, StatusBadge, UrgencyBadge } from '@shared/components/Card';
import { Link } from 'react-router-dom';
import { fetchPendingReportsThunk, verifyReportThunk } from '@features/verification/redux/verificationSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function VolunteerDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, submitting } = useAppSelector((s) => ({
    items: s.verification.items,
    loading: s.verification.loading,
    error: s.verification.error,
    submitting: s.verification.submitting,
  }));

  useEffect(() => {
    dispatch(fetchPendingReportsThunk());
  }, [dispatch]);

  const handleVerify = async (reportId: string, decision: 'VERIFIED' | 'REJECTED') => {
    await dispatch(verifyReportThunk({ reportId, decision, notes: '' }));
    dispatch(fetchPendingReportsThunk());
  };

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchPendingReportsThunk())} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">Volunteer Dashboard</h1>
      <p className="text-sm text-muted mb-4">{items.length} reports pending verification</p>

      {items.length === 0 ? (
        <EmptyState title="All caught up!" description="No pending reports to verify right now." />
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <Card key={String((r as unknown as Record<string, unknown>)._id ?? '')} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{(r as unknown as Record<string, unknown>).title as string}</h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2">{(r as unknown as Record<string, unknown>).description as string}</p>
                  <div className="mt-2 flex gap-2">
                    <UrgencyBadge urgency={(r as unknown as Record<string, unknown>).urgency as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'} />
                    <StatusBadge status={(r as unknown as Record<string, unknown>).status as 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CLAIMED' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="success" onClick={() => handleVerify(String((r as unknown as Record<string, unknown>)._id ?? ''), 'VERIFIED')} loading={submitting}>
                    Verify
                  </Button>
                  <Button size="sm" variant="critical" onClick={() => handleVerify(String((r as unknown as Record<string, unknown>)._id ?? ''), 'REJECTED')} loading={submitting}>
                    Reject
                  </Button>
                  <Link to={`/volunteer/reports/${(r as unknown as Record<string, unknown>)._id}`}>
                    <Button size="sm" variant="ghost">Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
