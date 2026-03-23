export const ROLES = {
  ADMIN: 'Admin',
  SECRETARIA: 'Secretaria',
  DOCTOR: 'Doctor',
  PACIENTE: 'Paciente',
}

// Arrays útiles para verificaciones
export const ROLES_GESTION = [ROLES.ADMIN, ROLES.SECRETARIA]
export const ROLES_MEDICOS = [ROLES.ADMIN, ROLES.DOCTOR]
export const TODOS_LOS_ROLES = Object.values(ROLES)
