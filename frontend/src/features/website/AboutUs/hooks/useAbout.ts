import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import {
  selectAboutData,
  selectAboutError,
  selectAboutIsDemo,
  selectAboutLoading,
  selectAboutMilestones,
  selectAboutStats,
  selectAboutTeam,
  selectAboutValues,
} from '../redux/aboutSelector';
import { fetchAboutThunk } from '../redux/aboutThunk';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAbout() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useAppSelector(selectAboutData);
  const stats = useAppSelector(selectAboutStats);
  const values = useAppSelector(selectAboutValues);
  const milestones = useAppSelector(selectAboutMilestones);
  const team = useAppSelector(selectAboutTeam);
  const loading = useAppSelector(selectAboutLoading);
  const error = useAppSelector(selectAboutError);
  const isDemo = useAppSelector(selectAboutIsDemo);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchAboutThunk());
    }
  }, [data, loading, dispatch]);

  return {
    data,
    stats,
    values,
    milestones,
    team,
    loading,
    error,
    isDemo,
    refresh: () => dispatch(fetchAboutThunk()),
  };
}