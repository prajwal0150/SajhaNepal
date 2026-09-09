import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { Report } from '@shared/types';
import { Button } from '@shared/components/Button';
import { Card, StatusBadge, UrgencyBadge, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { Link } from 'react-router-dom';
import { fetchAvailableClaimsThunk, claimReportThunk } from '@features/claims/redux/claimSlice';
import { pushToast } from '@shared/redux/toastSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function NgoDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, submitting, claimError } = useAppSelector((s) => ({
    items: s.claims.items,
    loading: s.claims.loading,
    error: s.claims.error,
    submitting: s.claims.submitting,
    claimError: s.claims.claimError,
  }));
  const myOrgs = useAppSelector((s) => s.organizations.myOrganizations);

  useEffect(() => {
    dispatch(fetchAvailableClaimsThunk());
  }, [dispatch]);

  const handleClaim = async (report: Report) => {
    const orgId = myOrgs[0]?._id;
    if (!orgId) { pushToast({ kind: 'error', message: 'You must belong to an organization to claim needs.' }); return; }
    try {
      await dispatch(claimReportThunk({ reportId: report._id, organizationId: orgId })).unwrap();
      pushToast({ kind: 'success', message: 'Need claimed successfully!' });
    } catch {
      pushToast({ kind: 'error', message: claimError ?? 'This need was just claimed by another organization.' });
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchAvailableClaimsThunk())} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">NGO Dashboard</h1>
      <p className="text-sm text-muted mb-4">{items.length} verified need(s) available for claiming</p>

      {items.length === 0 ? (
        <EmptyState title="No available needs" description="All verified needs have been claimed or there are none yet." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((report: Report) => (
            <Card key={report._id} className="p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">💧</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{report.title}</h3>
                  <p className="text-xs text-muted line-clamp-2 mt-1">{report.description}</p>
                  <div className="mt-2 flex gap-2">
                    <UrgencyBadge urgency={report.urgency} />
                    <StatusBadge status={report.status} />
                  </div>
                  <Button size="sm" variant="critical" className="mt-2 w-full"
                    onClick={() => handleClaim(report)} loading={submitting}>
                    Claim
                  </Button>
                  <Link to={`/reports/${report._id}`} className="mt-1 block text-center text-xs text-primary">Details</Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
