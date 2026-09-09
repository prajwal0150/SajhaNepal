import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { BarChart2, TrendingUp } from 'lucide-react';
import { Card, LoadingSkeleton, ErrorState } from '@shared/components/Card';
import { fetchOverviewThunk } from '@features/analytics/redux/analyticsSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function AnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, loading, error } = useAppSelector((s) => ({
    overview: s.analytics.overview,
    loading: s.analytics.loading,
    error: s.analytics.error,
  }));

  useEffect(() => {
    dispatch(fetchOverviewThunk());
  }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={4} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex items-center gap-3">
          <BarChart2 size={24} className="text-primary" />
          <div>
            <p className="text-2xl font-bold">{(overview?.totalReports as number) ?? 0}</p>
            <p className="text-xs text-muted">Total reports</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <TrendingUp size={24} className="text-success" />
          <div>
            <p className="text-2xl font-bold">{(overview?.resolved as number) ?? 0}</p>
            <p className="text-xs text-muted">Resolved</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
