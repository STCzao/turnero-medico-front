// Refleja exactamente los valores de EstadoTurno.cs del backend
export const ESTADO_TURNO = {
  SOLICITUD_PENDIENTE: 'SolicitudPendiente',
  CONFIRMADO: 'Confirmado',
  RECHAZADO: 'Rechazado',
  COMPLETADO: 'Completado',
  AUSENTE: 'Ausente',
  CANCELADO: 'Cancelado',
}

export const TODOS_LOS_ESTADOS = Object.values(ESTADO_TURNO)

// Etiquetas legibles para mostrar en UI
export const ESTADO_TURNO_LABEL = {
  [ESTADO_TURNO.SOLICITUD_PENDIENTE]: 'Pendiente',
  [ESTADO_TURNO.CONFIRMADO]: 'Confirmado',
  [ESTADO_TURNO.RECHAZADO]: 'Rechazado',
  [ESTADO_TURNO.COMPLETADO]: 'Completado',
  [ESTADO_TURNO.AUSENTE]: 'Ausente',
  [ESTADO_TURNO.CANCELADO]: 'Cancelado',
}

// Colores para badges (clases Tailwind)
export const ESTADO_TURNO_COLOR = {
  [ESTADO_TURNO.SOLICITUD_PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [ESTADO_TURNO.CONFIRMADO]: 'bg-blue-100 text-blue-800',
  [ESTADO_TURNO.RECHAZADO]: 'bg-red-100 text-red-800',
  [ESTADO_TURNO.COMPLETADO]: 'bg-green-100 text-green-800',
  [ESTADO_TURNO.AUSENTE]: 'bg-gray-100 text-gray-800',
  [ESTADO_TURNO.CANCELADO]: 'bg-orange-100 text-orange-800',
}
