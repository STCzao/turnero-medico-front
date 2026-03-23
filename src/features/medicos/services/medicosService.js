import api from '../../../services/api'

// El controller del backend se llama DoctoresController → ruta /api/Doctores
export const medicosService = {
  // Admin — listado paginado
  getAll: ({ page = 1, pageSize = 20 } = {}) =>
    api.get('/Doctores', { params: { page, pageSize } }),

  // Doctor autenticado — su propio perfil
  getMyProfile: () => api.get('/Doctores/me'),

  // Públic (auth) — por especialidad
  getByEspecialidad: (especialidad) =>
    api.get(`/Doctores/especialidad/${especialidad}`),

  getById: (id) => api.get(`/Doctores/${id}`),

  // Admin — CRUD
  crear: (data) => api.post('/Doctores', data),
  actualizar: (id, data) => api.put(`/Doctores/${id}`, data),
  eliminar: (id) => api.delete(`/Doctores/${id}`),
}
