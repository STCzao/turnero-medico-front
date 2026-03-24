import { useState, useEffect, useCallback } from 'react'
import { especialidadesService } from '../services/especialidadesService'

export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await especialidadesService.getAll()
      setEspecialidades(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []))
    } catch {
      setError('No se pudieron cargar las especialidades')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { especialidades, loading, error, refetch: fetch }
}
