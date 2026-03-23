import { useState, useEffect, useCallback } from 'react'
import { pacientesService } from '../services/pacientesService'

export function useMyProfile() {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await pacientesService.getMyProfile()
      setPerfil(data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar perfil')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { perfil, loading, error, refetch: fetch }
}

export function useDependientes() {
  const [dependientes, setDependientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await pacientesService.getMisDependientes()
      setDependientes(data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar dependientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const crearDependiente = useCallback(async (formData) => {
    const { data } = await pacientesService.crearDependiente(formData)
    await fetch()
    return data
  }, [fetch])

  return { dependientes, loading, error, crearDependiente, refetch: fetch }
}
