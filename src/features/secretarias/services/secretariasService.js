import api from '../../../services/api'

export const secretariasService = {
  getAll: ({ page = 1, pageSize = 20 } = {}) =>
    api.get('/Secretarias', { params: { page, pageSize } }),

  getById: (id) => api.get(`/Secretarias/${id}`),

  actualizar: (id, data) => api.put(`/Secretarias/${id}`, data),

  eliminar: (id) => api.delete(`/Secretarias/${id}`),
}
