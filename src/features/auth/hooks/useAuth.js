import { useState, useCallback } from 'react'
import { authService } from '../services/authService'
import useAuthStore from '../../../store/authSlice'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { login: storeLogin, logout: storeLogout } = useAuthStore()

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authService.login({ email, password })
      storeLogin(data.token)
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [storeLogin])

  const registerPaciente = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authService.registerPaciente(formData)
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrar'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    storeLogout()
  }, [storeLogout])

  return { login, registerPaciente, logout, loading, error }
}
