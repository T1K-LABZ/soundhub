import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { useAuthStore } from './auth.store'
import { useTokenRefresh } from './useTokenRefresh'

export function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()
  useTokenRefresh()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  if (user?.mustChangePassword && location.pathname !== ROUTES.changePassword) {
    return <Navigate to={ROUTES.changePassword} replace />
  }

  return <Outlet />
}
