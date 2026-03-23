import { useState, useEffect, useCallback } from 'react'
import { obrasSocialesService } from '../services/obrasSocialesService'

export function useObrasSociales({ page = 1, pageSize = 20 } = {}) {
  const [resultado, setResultado] = useState({ items: [], totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await obrasSocialesService.getAll({ page, pageSize })
      setResultado(data)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar obras sociales')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => { fetch() }, [fetch])

  return { ...resultado, loading, error, refetch: fetch }
}
