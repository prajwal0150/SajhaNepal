import { useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Skeleton } from '@shared/components/Card';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, initialized, refreshMe } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && initialized) {
      // no session
    }
  }, [isAuthenticated, initialized, refreshMe]);

  if (!initialized) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
