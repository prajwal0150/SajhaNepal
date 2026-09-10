import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { ResourceCategory } from '../types/resourcesTypes';
import {
  selectResourcesData,
  selectResourcesCategories,
  selectResourcesList,
  selectResourcesStats,
  selectResourcesLoading,
  selectResourcesError,
  selectResourcesCategory,
  selectResourcesIsDemo,
} from '../redux/resourcesSelector';
import { fetchResourcesThunk } from '../redux/resourcesThunk';
import { setResourcesCategory } from '../redux/resourcesSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useResources() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useAppSelector(selectResourcesData);
  const categories = useAppSelector(selectResourcesCategories);
  const resources = useAppSelector(selectResourcesList);
  const stats = useAppSelector(selectResourcesStats);
  const loading = useAppSelector(selectResourcesLoading);
  const error = useAppSelector(selectResourcesError);
  const activeCategory = useAppSelector(selectResourcesCategory);
  const isDemo = useAppSelector(selectResourcesIsDemo);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchResourcesThunk());
    }
  }, [data, loading, dispatch]);

  return {
    data,
    resources,
    categories,
    stats,
    loading,
    error,
    activeCategory,
    isDemo,
    setCategory: (c: ResourceCategory | 'ALL') => dispatch(setResourcesCategory(c)),
    refresh: () => dispatch(fetchResourcesThunk()),
  };
}