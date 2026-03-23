import { useState, useEffect } from 'react'
import { especialidadesService } from '../services/especialidadesService'

export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    especialidadesService.getAll()
      .then(({ data }) => setEspecialidades(data))
      .catch(() => setError('No se pudieron cargar las especialidades'))
      .finally(() => setLoading(false))
  }, [])

  return { especialidades, loading, error }
}
