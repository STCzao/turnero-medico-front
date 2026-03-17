import api from '../../../services/api'

export const authService = {
  // Público
  login: (data) => api.post('/Auth/login', data),
  registerPaciente: (data) => api.post('/Auth/register-paciente', data),

  // Solo Admin
  registerDoctor: (data) => api.post('/Auth/register-doctor', data),
  registerSecretaria: (data) => api.post('/Auth/register-secretaria', data),

  // Cualquier usuario autenticado
  getProfile: () => api.get('/Auth/profile'),
}
