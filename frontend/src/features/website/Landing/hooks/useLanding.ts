import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { LandingFilters } from '../types/landingTypes';
import {
  selectLandingData,
  selectLandingNeeds,
  selectLandingShelters,
  selectLandingStats,
  selectLandingLoading,
  selectLandingError,
  selectLandingFilters,
  selectLandingIsDemo,
} from '../redux/landingSelector';
import { fetchLandingThunk } from '../redux/landingThunk';
import { setLandingFilters } from '../redux/landingSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useLanding() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useAppSelector(selectLandingData);
  const stats = useAppSelector(selectLandingStats);
  const needs = useAppSelector(selectLandingNeeds);
  const shelters = useAppSelector(selectLandingShelters);
  const loading = useAppSelector(selectLandingLoading);
  const error = useAppSelector(selectLandingError);
  const filters = useAppSelector(selectLandingFilters);
  const isDemo = useAppSelector(selectLandingIsDemo);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchLandingThunk());
    }
  }, [data, loading, dispatch]);

  return {
    data,
    stats,
    needs,
    shelters,
    loading,
    error,
    filters,
    isDemo,
    setFilters: (f: Partial<LandingFilters>) => dispatch(setLandingFilters(f)),
    refresh: () => dispatch(fetchLandingThunk()),
  };
}
