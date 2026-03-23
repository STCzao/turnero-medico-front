import api from '../../../services/api'

// Horarios: configuración de disponibilidad de doctores
export const horariosService = {
  getByDoctor: (doctorId) => api.get(`/Horarios/doctor/${doctorId}`),

  // Admin / Secretaria / Paciente — slots libres para agendar
  getDisponibilidad: (doctorId, fecha) =>
    api.get(`/Horarios/doctor/${doctorId}/disponibilidad`, { params: { fecha } }),

  // Admin
  crear: (data) => api.post('/Horarios', data),
  eliminar: (id) => api.delete(`/Horarios/${id}`),
}
