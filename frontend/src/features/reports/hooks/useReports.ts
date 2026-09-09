import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { Report } from '@shared/types';
import {
  selectReports,
  selectReportsLoading,
  selectReportsError,
  selectReportFilters,
  selectReportsMeta,
} from '../redux/reportSelector';
import { fetchReportsThunk } from '../redux/reportThunk';
import { onSocketEvent } from '@shared/lib/socket';
import { setFilters, reportUpdatedRealtime, reportCreatedRealtime } from '../redux/reportSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useReports() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useAppSelector(selectReports);
  const loading = useAppSelector(selectReportsLoading);
  const error = useAppSelector(selectReportsError);
  const filters = useAppSelector(selectReportFilters);
  const meta = useAppSelector(selectReportsMeta);

  useEffect(() => {
    const offUpdated = onSocketEvent('report:updated', (payload) => {
      dispatch(reportUpdatedRealtime(payload as Report));
    });
    const offCreated = onSocketEvent('report:verified', (payload) => {
      dispatch(reportCreatedRealtime(payload as Report));
    });
    return () => {
      offUpdated();
      offCreated();
    };
  }, [dispatch]);

  const load = (overrides?: Partial<typeof filters> & { page?: number }) => {
    const merged = { ...filters, ...overrides };
    dispatch(fetchReportsThunk({
      search: merged.search || undefined,
      needType: merged.needType || undefined,
      urgency: merged.urgency || undefined,
      district: merged.district || undefined,
      page: overrides?.page ?? 1,
      limit: 12,
    }));
  };

  return {
    items, loading, error, filters, meta,
    setFilters: (f: Partial<typeof filters>) => dispatch(setFilters(f)),
    load,
    refresh: () => load(),
  };
}
