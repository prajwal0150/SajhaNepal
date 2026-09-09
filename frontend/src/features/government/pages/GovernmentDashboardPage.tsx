import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { BarChart2, Activity, Users, MapPin, CheckCircle, Clock, Building } from 'lucide-react';
import { Card, StatCard, LoadingSkeleton, ErrorState } from '@shared/components/Card';
import { fetchOverviewThunk, fetchReportAnalyticsThunk, fetchPerformanceThunk } from '@features/analytics/redux/analyticsSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function GovernmentDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, loading, error } = useAppSelector((s) => ({
    overview: s.analytics.overview,
    loading: s.analytics.loading,
    error: s.analytics.error,
  }));

  useEffect(() => {
    dispatch(fetchOverviewThunk());
    dispatch(fetchReportAnalyticsThunk());
    dispatch(fetchPerformanceThunk());
  }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchOverviewThunk())} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-6">Government Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Total Needs" value={(overview?.totalReports as number) ?? 0} icon={<MapPin size={20} />} />
        <StatCard label="Pending" value={(overview?.pending as number) ?? 0} icon={<Clock size={20} />} />
        <StatCard label="Verified" value={(overview?.verified as number) ?? 0} icon={<CheckCircle size={20} />} />
        <StatCard label="Resolved" value={(overview?.resolved as number) ?? 0} icon={<Activity size={20} />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Critical" value={(overview?.critical as number) ?? 0} icon={<BarChart2 size={20} />} accent="bg-critical/10 text-critical" />
        <StatCard label="Organizations" value={(overview?.organizations as number) ?? 0} icon={<Building size={20} />} />
        <StatCard label="Volunteers" value={(overview?.volunteers as number) ?? 0} icon={<Users size={20} />} />
        <StatCard label="Shelters" value={(overview?.shelters as number) ?? 0} icon={<MapPin size={20} />} />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-ink mb-3">Nepal-wide aggregated view</h2>
        <p className="text-sm text-muted">
          This data is anonymized and aggregated. Drill down by province/district to identify underserved areas.
        </p>
      </Card>
    </div>
  );
}
