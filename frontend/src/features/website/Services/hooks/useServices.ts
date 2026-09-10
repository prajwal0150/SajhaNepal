import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { ServiceCategory } from '../types/servicesTypes';
import {
  selectServicesData,
  selectServicesCategories,
  selectServicesList,
  selectServicesStats,
  selectServicesLoading,
  selectServicesError,
  selectServicesCategory,
  selectServicesIsDemo,
} from '../redux/servicesSelector';
import { fetchServicesThunk } from '../redux/servicesThunk';
import { setServicesCategory } from '../redux/servicesSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useServices() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useAppSelector(selectServicesData);
  const categories = useAppSelector(selectServicesCategories);
  const services = useAppSelector(selectServicesList);
  const stats = useAppSelector(selectServicesStats);
  const loading = useAppSelector(selectServicesLoading);
  const error = useAppSelector(selectServicesError);
  const activeCategory = useAppSelector(selectServicesCategory);
  const isDemo = useAppSelector(selectServicesIsDemo);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchServicesThunk());
    }
  }, [data, loading, dispatch]);

  return {
    data,
    services,
    categories,
    stats,
    loading,
    error,
    activeCategory,
    isDemo,
    setCategory: (c: ServiceCategory | 'ALL') => dispatch(setServicesCategory(c)),
    refresh: () => dispatch(fetchServicesThunk()),
  };
}