import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import TurnoCard from '../components/TurnoCard'
import { useHistorial } from '../hooks/useTurnos'
import { ESTADO_TURNO } from '../../../constants/estadosTurno'

const FILTROS = [
  { label: 'Todos',       value: null },
  { label: 'Completados', value: ESTADO_TURNO.COMPLETADO },
  { label: 'Ausentes',    value: ESTADO_TURNO.AUSENTE },
  { label: 'Cancelados',  value: ESTADO_TURNO.CANCELADO },
  { label: 'Rechazados',  value: ESTADO_TURNO.RECHAZADO },
]

export default function HistorialPage() {
  const [filtro, setFiltro] = useState(null)
  const { turnos, loading, error, refetch } = useHistorial()

  const turnosFiltrados = filtro
    ? turnos.filter((t) => t.estado === filtro)
    : turnos

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mi Historial</h1>
        <p className="text-deep/50 text-sm mt-1">Consultá tus atenciones médicas pasadas</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTROS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setFiltro(value)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
              filtro === value
                ? 'bg-deep text-mint shadow-sm'
                : 'bg-white text-deep/55 hover:text-deep border border-deep/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Skeleton de carga */}
      {loading && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-36 border border-deep/5" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 text-xs text-deep/50 hover:text-deep underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Vacío */}
      {!loading && !error && turnosFiltrados.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-deep font-bold text-lg">
            {filtro ? 'No tenés atenciones con ese estado' : 'No tenés atenciones en tu historial aún'}
          </p>
          <p className="text-deep/40 text-sm mt-1">
            Las consultas completadas aparecerán aquí
          </p>
        </motion.div>
      )}

      {/* Lista */}
      {!loading && !error && turnosFiltrados.length > 0 && (
        <motion.div layout className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {turnosFiltrados.map((turno) => (
              <TurnoCard key={turno.id} turno={turno} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageWrapper>
  )
}
