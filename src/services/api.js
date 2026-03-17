import axios from 'axios'

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL no está definida. Revisá tu archivo .env')
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir si había una sesión activa (token guardado).
    // Un 401 en el endpoint de login significa credenciales incorrectas, no sesión expirada.
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
