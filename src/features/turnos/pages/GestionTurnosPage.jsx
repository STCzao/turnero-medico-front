import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Badge from '../../../components/ui/Badge'
import { useTurnosPaginados } from '../hooks/useTurnos'
import { ESTADO_TURNO } from '../../../constants/estadosTurno'
import { formatFechaHora } from '../../../utils/formatFecha'
import Pagination from '../../../components/ui/Pagination'

const FILTROS = [
  { label: 'Todos',       value: undefined },
  { label: 'Pendientes',  value: ESTADO_TURNO.SOLICITUD_PENDIENTE },
  { label: 'Confirmados', value: ESTADO_TURNO.CONFIRMADO },
  { label: 'Completados', value: ESTADO_TURNO.COMPLETADO },
  { label: 'Ausentes',    value: ESTADO_TURNO.AUSENTE },
  { label: 'Cancelados',  value: ESTADO_TURNO.CANCELADO },
  { label: 'Rechazados',  value: ESTADO_TURNO.RECHAZADO },
]

const PAGE_SIZE = 15

export default function GestionTurnosPage() {
  const [page, setPage] = useState(1)
  const [estado, setEstado] = useState(undefined)
  const { items = [], totalCount = 0, loading, error, refetch } = useTurnosPaginados({ page, pageSize: PAGE_SIZE, estado })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleFiltro = (value) => {
    setEstado(value)
    setPage(1)
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Gestión de turnos</h1>
        <p className="text-deep/50 text-sm mt-1">Todos los turnos del sistema</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTROS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => handleFiltro(value)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              estado === value
                ? 'bg-deep text-mint shadow-sm'
                : 'bg-white text-deep/55 hover:text-deep border border-deep/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-deep/5" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={refetch} className="mt-3 text-xs text-deep/50 hover:text-deep underline">
            Reintentar
          </button>
        </div>
      )}

      {/* Vacío */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-20 text-deep/30">
          <p className="text-sm">No hay turnos{estado ? ' con ese estado' : ''}</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {totalCount} turno{totalCount !== 1 ? 's' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            {/* Header tabla — solo desktop */}
            <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr_1.2fr_auto] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Paciente</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Especialidad</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Médico</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Fecha y hora</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Estado</span>
            </div>

            <AnimatePresence>
              {items.map((turno, idx) => (
                <motion.div
                  key={turno.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-4 flex flex-col md:grid md:grid-cols-[1.2fr_1fr_1fr_1.2fr_auto] md:items-center gap-1.5 md:gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <p className="text-sm font-semibold text-deep">{turno.pacienteNombre ?? '—'}</p>
                  <p className="text-sm text-deep/60">{turno.especialidadNombre ?? '—'}</p>
                  <p className="text-sm text-deep/50">{turno.doctorNombre ?? 'Sin asignar'}</p>
                  <p className="text-sm text-deep/50">{formatFechaHora(turno.fechaHora)}</p>
                  <Badge estado={turno.estado} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Paginación */}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </PageWrapper>
  )
}
