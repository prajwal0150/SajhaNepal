import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { NeedType } from '@shared/types';
import { Button } from '@shared/components/Button';
import { Card, EmptyState, ErrorState, LoadingSkeleton } from '@shared/components/Card';
import { Input, Select } from '@shared/components/Fields';
import { Link } from 'react-router-dom';
import { NEED_TYPES, NEED_TYPE_META, URGENCY_LEVELS } from '@shared/constants';
import { Pagination } from '@shared/components/DataTable';
import { ReportCard } from '../components/ReportCard';
import { Search, ClipboardList } from 'lucide-react';
import { selectReports, selectReportsLoading, selectReportsError, selectReportFilters, selectReportsMeta } from '../redux/reportSelector';
import { setFilters } from '../redux/reportSlice';
import { useReports } from '../hooks/useReports';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { load } = useReports();
  const items = useAppSelector(selectReports);
  const loading = useAppSelector(selectReportsLoading);
  const error = useAppSelector(selectReportsError);
  const filters = useAppSelector(selectReportFilters);
  const meta = useAppSelector(selectReportsMeta);
  const [search, setSearch] = useState(filters.search);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch(setFilters({ search }));
    load({ search });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Public Needs</h1>
          <p className="text-sm text-muted">Verified and in-progress needs across Nepal. Sensitive details are protected.</p>
        </div>
        <Link to="/report"><Button>Report a need</Button></Link>
      </div>

      <Card className="mb-6 p-4">
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <Input
              aria-label="Search needs"
              placeholder="Search needs…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            aria-label="Filter by need type"
            value={filters.needType}
            onChange={(e) => { dispatch(setFilters({ needType: e.target.value })); load({ needType: e.target.value }); }}
          >
            <option value="">All need types</option>
            {NEED_TYPES.map((t) => (
              <option key={t} value={t}>{NEED_TYPE_META[t as NeedType].en} · {NEED_TYPE_META[t as NeedType].ne}</option>
            ))}
          </Select>
          <Select
            aria-label="Filter by urgency"
            value={filters.urgency}
            onChange={(e) => { dispatch(setFilters({ urgency: e.target.value })); load({ urgency: e.target.value }); }}
          >
            <option value="">All urgency</option>
            {URGENCY_LEVELS.map((u) => <option key={u} value={u}>{u}</option>)}
          </Select>
          <Button type="submit">Apply filters</Button>
        </form>
      </Card>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={36} />}
          title="No needs match your filters"
          description="Try clearing filters, or be the first to report a need in your area."
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-muted">{meta.total} need{meta.total === 1 ? '' : 's'} found</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((r) => <ReportCard key={r._id} report={r} />)}
          </div>
          <Pagination page={meta.page} totalPages={meta.totalPages} onChange={(p) => load({ page: p })} />
        </>
      )}
    </div>
  );
}
