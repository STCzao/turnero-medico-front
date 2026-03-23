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

const storedToken = localStorage.getItem(TOKEN_KEY)
const storedPayload = storedToken ? decodeJwt(storedToken) : null

// El backend usa ClaimTypes.Role que se serializa como el claim estándar
const getRol = (payload) =>
  payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
  payload?.role ||
  null

const useAuthStore = create((set) => ({
  token: storedToken,
  user: storedPayload
    ? {
        id: storedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || storedPayload.sub,
        email: storedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || storedPayload.email,
        nombre: storedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || storedPayload.name,
        rol: getRol(storedPayload),
      }
    : null,
  isAuthenticated: !!storedToken,

  login: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
    const payload = decodeJwt(token)
    set({
      token,
      isAuthenticated: true,
      user: {
        id: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload?.sub,
        email: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload?.email,
        nombre: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload?.name,
        rol: getRol(payload),
      },
    })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
