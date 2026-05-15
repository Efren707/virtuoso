import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../store';

export default function PrivateRoute() {
  const token = useSelector((state: RootState) => state.auth.token);
  const isSleeperLinked = useSelector((state: RootState) => state.auth.isSleeperLinked);

  if (!token) return <Navigate to="/login" replace />;
  if (!isSleeperLinked) return <Navigate to="/link-sleeper" replace />;

  return <Outlet />;
}
