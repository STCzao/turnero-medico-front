import { create } from 'zustand'

// Decodifica el payload del JWT sin librerías externas
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_ID_KEY = 'userId'

const storedToken = localStorage.getItem(TOKEN_KEY)
const storedPayload = storedToken ? decodeJwt(storedToken) : null

// El backend usa ClaimTypes.Role que se serializa como el claim estándar
const getRol = (payload) =>
  payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
  payload?.role ||
  null

const useAuthStore = create((set) => ({
  token: storedToken,
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  user: storedPayload
    ? {
        id: storedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || storedPayload.sub,
        email: storedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || storedPayload.email,
        nombre: storedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || storedPayload.name,
        rol: getRol(storedPayload),
      }
    : null,
  isAuthenticated: !!storedToken,

  login: (token, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, token)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    const payload = decodeJwt(token)
    const userId = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload?.sub
    if (userId) localStorage.setItem(USER_ID_KEY, userId)
    set({
      token,
      refreshToken: refreshToken ?? null,
      isAuthenticated: true,
      user: {
        id: userId,
        email: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload?.email,
        nombre: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload?.name,
        rol: getRol(payload),
      },
    })
  },

  // Actualiza solo los tokens tras una renovación exitosa (sin tocar user)
  setTokens: (token, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    set({ token, refreshToken })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
