import { useState, useEffect, useCallback } from 'react'
import { medicosService } from '../services/medicosService'
import { horariosService } from '../../admin/services/horariosService'

export function useMedicos({ page = 1, pageSize = 20 } = {}) {
  const [resultado, setResultado] = useState({ items: [], totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await medicosService.getAll({ page, pageSize })
      setResultado({ ...data, totalCount: data.total })
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar doctores')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => { fetch() }, [fetch])

  return { ...resultado, loading, error, refetch: fetch }
}

export function useMedicosByEspecialidad(especialidad) {
  const [medicos, setMedicos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!especialidad) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await medicosService.getByEspecialidad(especialidad)
      setMedicos(Array.isArray(data) ? data : [])
    } catch (err) {
      // El backend devuelve 404 cuando no hay doctores para esa especialidad → tratar como lista vacía
      if (err.response?.status === 404) {
        setMedicos([])
      } else {
        setError(err.response?.data?.mensaje || 'Error al filtrar doctores')
      }
    } finally {
      setLoading(false)
    }
  }, [especialidad])

  useEffect(() => { fetch() }, [fetch])

  return { medicos, loading, error, refetch: fetch }
}

export function useDisponibilidad(doctorId, fecha) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!doctorId || !fecha) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await horariosService.getDisponibilidad(doctorId, fecha)
      setSlots(data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar disponibilidad')
    } finally {
      setLoading(false)
    }
  }, [doctorId, fecha])

  useEffect(() => { fetch() }, [fetch])

  return { slots, loading, error, refetch: fetch }
}
