import { useState, useEffect, useCallback, useRef } from 'react'
import { turnosService } from '../services/turnosService'

// Hook para el paciente / doctor — ver sus propios turnos
export function useMisTurnos(estado) {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await turnosService.getMisTurnos(estado)
      setTurnos(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []))
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar turnos')
    } finally {
      setLoading(false)
    }
  }, [estado])

  useEffect(() => { fetch() }, [fetch])

  return { turnos, loading, error, refetch: fetch }
}

// Hook para Admin / Secretaria — listado paginado con filtro de estado
export function useTurnosPaginados({ page = 1, pageSize = 20, estado } = {}) {
  const [resultado, setResultado] = useState({ items: [], totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await turnosService.getAll({ page, pageSize, estado })
      setResultado({ ...data, totalCount: data.total })
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar turnos')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, estado])

  useEffect(() => { fetch() }, [fetch])

  return { ...resultado, loading, error, refetch: fetch }
}

// Hook para Secretaria / Admin — turnos pendientes de gestión
export function useTurnosPendientes({ page = 1, pageSize = 20 } = {}) {
  const [resultado, setResultado] = useState({ items: [], totalCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await turnosService.getPendientes({ page, pageSize })
      setResultado({ ...data, totalCount: data.total })
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar pendientes')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => { fetch() }, [fetch])

  return { ...resultado, loading, error, refetch: fetch }
}

// Hook para acciones sobre un turno (confirmar, rechazar, cancelar, etc.)
export function useTurnoActions(onSuccess) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const ejecutar = useCallback(async (accion, ...args) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await accion(...args)
      onSuccess?.()
      return data
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al procesar el turno'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  const crear = (data) => ejecutar(turnosService.crear, data)
  const confirmar = (id, data) => ejecutar(turnosService.confirmar, id, data)
  const rechazar = (id, data) => ejecutar(turnosService.rechazar, id, data)
  const cancelar = (id, data) => ejecutar(turnosService.cancelar, id, data)
  const actualizar = (id, data) => ejecutar(turnosService.actualizar, id, data)

  return { crear, confirmar, rechazar, cancelar, actualizar, loading, error }
}

// Hook para Paciente/Doctor — ver su propio historial clínico (turnos completados)
export function useHistorial() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await turnosService.getMisTurnos()
      const todos = Array.isArray(data) ? data : (data?.items ?? data?.data ?? [])
      const ESTADOS_HISTORIAL = ['Completado', 'Cancelado', 'Ausente', 'Rechazado']
      setTurnos(todos.filter(t => ESTADOS_HISTORIAL.includes(t.estado)))
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar el historial')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { turnos, loading, error, refetch: fetch }
}

// Hook para Doctor — agenda del día por fecha
export function useAgendaDoctor(fecha) {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await turnosService.getMyAgenda(fecha)
      setTurnos(Array.isArray(data) ? data : (data?.items ?? data?.data ?? []))
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar la agenda')
    } finally {
      setLoading(false)
    }
  }, [fecha])

  useEffect(() => { fetch() }, [fetch])

  return { turnos, loading, error, refetch: fetch }
}

// Hook para Paciente — ver turnos de todos sus dependientes en paralelo
export function useTurnosFamiliares(dependientes) {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const refetchKeyRef = useRef(0)
  const [refetchKey, setRefetchKey] = useState(0)

  useEffect(() => {
    if (!dependientes.length) {
      setTurnos([])
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all(
      dependientes.map(dep =>
        turnosService.getByPaciente(dep.id).then(({ data }) => {
          const items = Array.isArray(data) ? data : (data?.items ?? data?.data ?? [])
          return items.map(t => ({
            ...t,
            pacienteNombre: `${dep.nombre} ${dep.apellido}`,
            pacienteId: dep.id,
          }))
        })
      )
    )
      .then(results => {
        if (cancelled) return
        setTurnos(
          results.flat().sort((a, b) => {
            if (!a.fechaHora) return 1
            if (!b.fechaHora) return -1
            return new Date(b.fechaHora) - new Date(a.fechaHora)
          })
        )
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.response?.data?.mensaje || 'Error al cargar turnos de familiares')
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [dependientes, refetchKey])

  const refetch = useCallback(() => {
    refetchKeyRef.current += 1
    setRefetchKey(refetchKeyRef.current)
  }, [])

  return { turnos, loading, error, refetch }
}
