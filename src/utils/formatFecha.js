const FECHA_OPTS = { day: '2-digit', month: '2-digit', year: 'numeric' }
const HORA_OPTS = { hour: '2-digit', minute: '2-digit' }
const LOCALE = 'es-AR'

export const formatFecha = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(LOCALE, FECHA_OPTS)
}

export const formatFechaHora = (iso) => {
  if (!iso) return 'Sin fecha asignada'
  const d = new Date(iso)
  return `${d.toLocaleDateString(LOCALE, FECHA_OPTS)} ${d.toLocaleTimeString(LOCALE, HORA_OPTS)}`
}

export const formatHora = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString(LOCALE, HORA_OPTS)
}

export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const diff = hoy.getMonth() - nac.getMonth()
  if (diff < 0 || (diff === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

// Formatea fecha a YYYY-MM-DD para enviar al backend
export const toISODate = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}
