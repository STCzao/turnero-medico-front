import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authSlice'
import { getHomeByRol } from './redirect'

// Si el usuario ya está autenticado, lo redirige a su home según rol
export default function PublicRoute() {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to={getHomeByRol(user?.rol)} replace />
  }

  return <Outlet />
}
