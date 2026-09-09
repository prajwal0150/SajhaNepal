import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { useNavigate } from 'react-router-dom';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectAuthRole,
  selectAuthSubmitting,
  selectAuthError,
  selectAuthInitialized,
} from '../redux/authSelector';
import { loginThunk, logoutThunk, registerThunk, fetchMeThunk } from '../redux/authThunk';
import { clearAuthError } from '../redux/authSlice';
import { connectSocket, disconnectSocket } from '@shared/lib/socket';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const HOME_BY_ROLE: Record<string, string> = {
  CITIZEN: '/map',
  VOLUNTEER: '/volunteer/dashboard',
  NGO: '/ngo/dashboard',
  GOVERNMENT: '/government/dashboard',
  ADMIN: '/admin/dashboard',
};

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectAuthRole);
  const submitting = useAppSelector(selectAuthSubmitting);
  const error = useAppSelector(selectAuthError);
  const initialized = useAppSelector(selectAuthInitialized);

  useEffect(() => {
    if (isAuthenticated) connectSocket();
    else disconnectSocket();
  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated,
    role,
    submitting,
    error,
    initialized,
    homePath: role ? HOME_BY_ROLE[role] ?? '/map' : '/',
    login: async (email: string, password: string) => {
      const result = await dispatch(loginThunk({ email, password }));
      if (loginThunk.fulfilled.match(result)) {
        navigate(HOME_BY_ROLE[result.payload.user.role] ?? '/map');
        return true;
      }
      return false;
    },
    register: async (payload: Parameters<typeof registerThunk>[0]) => {
      const result = await dispatch(registerThunk(payload));
      if (registerThunk.fulfilled.match(result)) {
        navigate(HOME_BY_ROLE[result.payload.user.role] ?? '/map');
        return true;
      }
      return false;
    },
    logout: async () => {
      await dispatch(logoutThunk());
      navigate('/login');
    },
    clearError: () => dispatch(clearAuthError()),
    refreshMe: () => dispatch(fetchMeThunk()),
  };
}
