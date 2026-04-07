import axios from 'axios'
import useAuthStore from '../store/authSlice'

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

// Flag para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false
let refreshQueue = []

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => error ? p.reject(error) : p.resolve(token))
  refreshQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Solo intentar refresh si: es un 401, había token, y no es ya un retry
    if (
      error.response?.status === 401 &&
      localStorage.getItem('token') &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem('refreshToken')
      const userId = localStorage.getItem('userId')

      // Sin refresh token disponible → logout directo
      if (!refreshToken || !userId) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Encolar requests que lleguen mientras se está renovando
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/Auth/refresh`,
          { userId, refreshToken }
        )
        useAuthStore.getState().setTokens(data.token, data.refreshToken)
        processQueue(null, data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
