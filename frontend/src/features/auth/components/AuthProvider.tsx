import { useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/Store';
import { fetchMeThunk } from '@features/auth/redux/authThunk';
import { pushToast } from '@shared/redux/toastSlice';
import { setAuthFailureHandler } from '@shared/lib/axios';

/**
 * AuthProvider: on mount, restores the session by calling /auth/me.
 * Also wires the global 401 handler to log the user out on hard auth failures.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMeThunk());

    setAuthFailureHandler(() => {
      pushToast({ kind: 'error', message: 'Your session has expired. Please log in again.' });
    });
  }, [dispatch]);

  return <>{children}</>;
}
