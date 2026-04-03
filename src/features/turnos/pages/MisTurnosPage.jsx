import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import TurnoCard from '../components/TurnoCard'
import { useMisTurnos, useTurnoActions } from '../hooks/useTurnos'
import { ESTADO_TURNO } from '../../../constants/estadosTurno'
import { ROUTES } from '../../../router/routes'

const FILTROS = [
  { label: 'Todos',       value: undefined },
  { label: 'Pendientes',  value: ESTADO_TURNO.SOLICITUD_PENDIENTE },
  { label: 'Confirmados', value: ESTADO_TURNO.CONFIRMADO },
  { label: 'Completados', value: ESTADO_TURNO.COMPLETADO },
  { label: 'Cancelados',  value: ESTADO_TURNO.CANCELADO },
  { label: 'Rechazados',  value: ESTADO_TURNO.RECHAZADO },
]

export default function MisTurnosPage() {
  const [filtro, setFiltro] = useState(undefined)
  const { turnos, loading, error, refetch } = useMisTurnos(filtro)
  const { cancelar, loading: cancelLoading } = useTurnoActions(refetch)

  const handleCancel = (id) => cancelar(id, { motivo: 'Cancelado por el paciente' })

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mis Turnos</h1>
          <p className="text-deep/50 text-sm mt-1">Revisá y gestioná tus turnos médicos</p>
        </div>
        <Link
          to={ROUTES.SOLICITAR_TURNO}
          className="flex items-center justify-center gap-1.5 bg-deep text-mint font-bold text-sm px-5 py-3 rounded-xl hover:bg-navy transition-colors sm:shrink-0 w-full sm:w-auto"
        >
          + Solicitar turno
        </Link>
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
      {!loading && !error && turnos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-deep font-bold text-lg">No tenés turnos{filtro ? ' con ese estado' : ' aún'}</p>
          <p className="text-deep/40 text-sm mt-1">Solicitá tu primer turno médico</p>
          <Link
            to={ROUTES.SOLICITAR_TURNO}
            className="inline-block mt-5 bg-deep text-mint font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-navy transition-colors"
          >
            Solicitar turno
          </Link>
        </motion.div>
      )}

      {/* Lista */}
      {!loading && !error && turnos.length > 0 && (
        <motion.div layout className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {turnos.map((turno) => (
              <TurnoCard
                key={turno.id}
                turno={turno}
                onCancel={handleCancel}
                cancelLoading={cancelLoading}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageWrapper>
  )
}
