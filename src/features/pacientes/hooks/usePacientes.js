import { useState, useEffect, useCallback } from 'react'
import { pacientesService } from '../services/pacientesService'

export function usePacientesPaginados({ page = 1, pageSize = 20 } = {}) {
  const [resultado, setResultado] = useState({ items: [], totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await pacientesService.getAll({ page, pageSize })
      setResultado({ ...data, totalCount: data.total })
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar pacientes')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => { fetch() }, [fetch])

  return { ...resultado, loading, error, refetch: fetch }
}

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

  const update = useCallback(async (formData) => {
    await pacientesService.updateMyProfile(perfil.id, { ...formData, id: perfil.id, dni: perfil.dni })
    await fetch()
  }, [fetch, perfil])

  return { perfil, loading, error, refetch: fetch, update }
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
      setDependientes(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []))
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
