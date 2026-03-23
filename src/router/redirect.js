import { ROLES } from '../constants/roles'
import { ROUTES } from './routes'

// Devuelve la ruta home según el rol del usuario autenticado
export const getHomeByRol = (rol) => {
  switch (rol) {
    case ROLES.PACIENTE:    return ROUTES.MIS_TURNOS
    case ROLES.DOCTOR:      return ROUTES.MI_AGENDA
    case ROLES.SECRETARIA:  return ROUTES.TURNOS_PENDIENTES
    case ROLES.ADMIN:       return ROUTES.ADMIN_DASHBOARD
    default:                return ROUTES.LOGIN
  }
}
