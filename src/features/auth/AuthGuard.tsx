import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useAuthStore } from './auth.store'

export function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}
