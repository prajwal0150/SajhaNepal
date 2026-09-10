import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import {
  selectHowData,
  selectHowError,
  selectHowIsDemo,
  selectHowLoading,
  selectHowRoles,
  selectHowStats,
  selectHowSteps,
  selectHowVerifyPoints,
} from '../redux/howSelector';
import { fetchHowThunk } from '../redux/howThunk';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useHow() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useAppSelector(selectHowData);
  const stats = useAppSelector(selectHowStats);
  const steps = useAppSelector(selectHowSteps);
  const roles = useAppSelector(selectHowRoles);
  const verifyPoints = useAppSelector(selectHowVerifyPoints);
  const loading = useAppSelector(selectHowLoading);
  const error = useAppSelector(selectHowError);
  const isDemo = useAppSelector(selectHowIsDemo);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchHowThunk());
    }
  }, [data, loading, dispatch]);

  return {
    data,
    stats,
    steps,
    roles,
    verifyPoints,
    loading,
    error,
    isDemo,
    refresh: () => dispatch(fetchHowThunk()),
  };
}