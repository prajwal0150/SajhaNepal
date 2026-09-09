import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RoleRoute({ roles }: { roles: string[] }) {
  const { role, initialized, isAuthenticated } = useAuth();

  if (!initialized || (isAuthenticated && !role)) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
