import { useState, useCallback } from 'react'

export function usePaginacion({ pageSize = 20 } = {}) {
  const [page, setPage] = useState(1)

  const siguiente = useCallback((totalCount) => {
    if (page * pageSize < totalCount) setPage((p) => p + 1)
  }, [page, pageSize])

  const anterior = useCallback(() => {
    if (page > 1) setPage((p) => p - 1)
  }, [page])

  const irA = useCallback((n) => setPage(n), [])

  const totalPaginas = (totalCount) => Math.ceil(totalCount / pageSize)

  return { page, pageSize, siguiente, anterior, irA, totalPaginas }
}
