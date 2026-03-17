import api from '../../services/api'

// Obras sociales — GET público (auth), CUD solo Admin/Secretaria
export const obrasSocialesService = {
  getAll: ({ page = 1, pageSize = 20 } = {}) =>
    api.get('/ObrasSociales', { params: { page, pageSize } }),

  getById: (id) => api.get(`/ObrasSociales/${id}`),

  // Admin / Secretaria
  crear: (data) => api.post('/ObrasSociales', data),
  actualizar: (id, data) => api.put(`/ObrasSociales/${id}`, data),
  eliminar: (id) => api.delete(`/ObrasSociales/${id}`),
}
