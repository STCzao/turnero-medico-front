import api from '../../../services/api'

export const turnosService = {
  // Paciente / Doctor — ver mis propios turnos
  getMisTurnos: (estado) =>
    api.get('/Turnos/me', { params: { estado } }),

  // Doctor — agenda del día
  getMyAgenda: (fecha) =>
    api.get('/Turnos/doctor/me/agenda', { params: { fecha } }),

  // Admin / Secretaria — listado paginado
  getAll: ({ page = 1, pageSize = 20, estado } = {}) =>
    api.get('/Turnos', { params: { page, pageSize, estado } }),

  // Admin / Secretaria — pendientes de gestión
  getPendientes: ({ page = 1, pageSize = 20 } = {}) =>
    api.get('/Turnos/pendientes', { params: { page, pageSize } }),

  // Por paciente o doctor (Admin / Secretaria)
  getByPaciente: (pacienteId, estado) =>
    api.get(`/Turnos/paciente/${pacienteId}`, { params: { estado } }),

  getByDoctor: (doctorId, estado) =>
    api.get(`/Turnos/doctor/${doctorId}`, { params: { estado } }),

  // Historial clínico de un paciente
  getHistorial: (pacienteId) =>
    api.get(`/Turnos/paciente/${pacienteId}/historial`),

  getById: (id) => api.get(`/Turnos/${id}`),

  // Paciente / Secretaria / Admin — solicitar turno (sin fecha)
  crear: (data) => api.post('/Turnos', data),

  // Secretaria / Admin — confirmar, asigna fecha y doctor
  confirmar: (id, data) => api.post(`/Turnos/${id}/confirmar`, data),

  // Secretaria / Admin — rechazar con motivo
  rechazar: (id, data) => api.post(`/Turnos/${id}/rechazar`, data),

  // Paciente / Doctor / Secretaria / Admin — cancelar
  cancelar: (id, data) => api.post(`/Turnos/${id}/cancelar`, data),

  // Doctor / Admin — marcar Completado / Ausente + observación clínica
  actualizar: (id, data) => api.patch(`/Turnos/${id}`, data),

  // Admin — eliminar
  eliminar: (id) => api.delete(`/Turnos/${id}`),
}
