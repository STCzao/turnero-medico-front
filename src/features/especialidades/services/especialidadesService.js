import api from '../../../services/api'

export const especialidadesService = {
  getAll: () => api.get('/Especialidades'),

  getById: (id) => api.get(`/Especialidades/${id}`),

  // Admin
  crear: (data) => api.post('/Especialidades', data),
  actualizar: (id, data) => api.put(`/Especialidades/${id}`, data),
  eliminar: (id) => api.delete(`/Especialidades/${id}`),
}
