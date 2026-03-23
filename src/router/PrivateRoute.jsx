import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from './routes'
import useAuthStore from '../store/authSlice'

/**
 * Guard de ruta autenticada.
 * @param {string[]} roles - Si se indica, solo esos roles pueden acceder.
 */
export default function PrivateRoute({ roles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user?.rol)) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
