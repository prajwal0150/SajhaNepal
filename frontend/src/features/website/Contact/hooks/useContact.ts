import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import {
  selectContactData,
  selectContactChannels,
  selectContactStats,
  selectContactError,
  selectContactIsDemo,
  selectContactLoading,
} from '../redux/contactSelector';
import { fetchContactThunk } from '../redux/contactThunk';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useContact() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useAppSelector(selectContactData);
  const channels = useAppSelector(selectContactChannels);
  const stats = useAppSelector(selectContactStats);
  const loading = useAppSelector(selectContactLoading);
  const error = useAppSelector(selectContactError);
  const isDemo = useAppSelector(selectContactIsDemo);

  useEffect(() => {
    if (!data && !loading) {
      void dispatch(fetchContactThunk());
    }
  }, [data, loading, dispatch]);

  return {
    data,
    channels,
    stats,
    loading,
    error,
    isDemo,
    refresh: () => dispatch(fetchContactThunk()),
  };
}
