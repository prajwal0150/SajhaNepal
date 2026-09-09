import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { Link } from 'react-router-dom';
import { LoadingSkeleton, EmptyState } from '@shared/components/Card';
import { ReportCard } from '../components/ReportCard';
import { fetchMyReportsThunk } from '../redux/reportThunk';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function MyReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((s) => ({
    items: s.reports.myReports,
    loading: s.reports.loading,
    error: s.reports.error,
  }));
  const filters = useAppSelector((s) => s.reports.filters);

  useEffect(() => {
    dispatch(fetchMyReportsThunk());
  }, [dispatch, filters]);

  if (loading) return <LoadingSkeleton rows={8} />;
  if (error) return <EmptyState title="Error" description={error} />;
  if (items.length === 0) return <EmptyState title="No reports yet" description="You haven't submitted any reports." />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-4">My Reports</h1>
      <div className="space-y-4">
        {items.map((r) => (
          <Link key={r._id} to={`/reports/${r._id}`}>
            <ReportCard report={r} />
          </Link>
        ))}
      </div>
    </div>
  );
}
