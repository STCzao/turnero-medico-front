import api from '../../../services/api'

export const pacientesService = {
  // Propio perfil (cualquier rol autenticado)
  getMyProfile: () => api.get('/Pacientes/me'),
  updateMyProfile: (id, data) => api.put(`/Pacientes/${id}`, data),

  // Admin / Secretaria
  getAll: ({ page = 1, pageSize = 20 } = {}) =>
    api.get('/Pacientes', { params: { page, pageSize } }),

  getById: (id) => api.get(`/Pacientes/${id}`),

  // Admin / Secretaria — crear paciente sin cuenta de usuario
  crear: (data) => api.post('/Pacientes', data),

  // Admin
  actualizar: (id, data) => api.put(`/Pacientes/${id}`, data),
  eliminar: (id) => api.delete(`/Pacientes/${id}`),

  // Paciente — dependientes (menores sin cuenta)
  getMisDependientes: () => api.get('/Pacientes/mis-dependientes'),
  crearDependiente: (data) => api.post('/Pacientes/dependientes', data),
  actualizarDependiente: (id, data) => api.put(`/Pacientes/dependientes/${id}`, data),
  eliminarDependiente: (id) => api.delete(`/Pacientes/dependientes/${id}`),
}
