export const ROUTES = {
  // Públicas
  LOGIN: '/login',
  REGISTER: '/register',

  // Paciente
  HOME: '/inicio',
  MIS_TURNOS: '/mis-turnos',
  SOLICITAR_TURNO: '/mis-turnos/solicitar',
  PERFIL: '/perfil',
  HISTORIAL: '/historial',
  DEPENDIENTES: '/perfil/dependientes',

  // Doctor
  MI_AGENDA: '/agenda',

  // Admin / Secretaria
  TURNOS_PENDIENTES: '/gestion/pendientes',
  GESTION_TURNOS: '/gestion/turnos',
  GESTION_MEDICOS: '/gestion/medicos',
  GESTION_PACIENTES: '/gestion/pacientes',
  GESTION_OBRAS_SOCIALES: '/gestion/obras-sociales',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_HORARIOS: '/admin/horarios',
  ADMIN_USUARIOS: '/admin/usuarios',

  // Detalle
  DETALLE_MEDICO: '/medicos/:id',
}
