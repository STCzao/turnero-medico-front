import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import TurnoPendienteCard from '../components/TurnoPendienteCard'
import ModalConfirmar from '../components/ModalConfirmar'
import ModalRechazar from '../components/ModalRechazar'
import { useTurnosPendientes } from '../hooks/useTurnos'

const PAGE_SIZE = 12

export default function GestionPendientesPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useTurnosPendientes({ page, pageSize: PAGE_SIZE })

  const [turnoConfirmar, setTurnoConfirmar] = useState(null)
  const [turnoRechazar, setTurnoRechazar] = useState(null)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleSuccess = () => {
    setTurnoConfirmar(null)
    setTurnoRechazar(null)
    refetch()
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Solicitudes pendientes</h1>
        <p className="text-deep/50 text-sm mt-1">
          Confirmá o rechazá las solicitudes de turno de los pacientes
        </p>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-44 border border-deep/5" />
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
      {!loading && !error && items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <svg className="w-12 h-12 mx-auto mb-4 text-deep/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-deep font-bold text-lg">No hay solicitudes pendientes</p>
          <p className="text-deep/40 text-sm mt-1">Todas las solicitudes han sido gestionadas</p>
        </motion.div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          {totalCount > 0 && (
            <p className="text-xs text-deep/40 mb-4">
              {totalCount} solicitud{totalCount !== 1 ? 'es' : ''} pendiente{totalCount !== 1 ? 's' : ''}
            </p>
          )}
          <motion.div layout className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {items.map((turno) => (
                <TurnoPendienteCard
                  key={turno.id}
                  turno={turno}
                  onConfirmar={setTurnoConfirmar}
                  onRechazar={setTurnoRechazar}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-deep/10 flex items-center justify-center text-deep/50 hover:text-deep hover:border-deep/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                    n === page
                      ? 'bg-deep text-mint'
                      : 'border border-deep/10 text-deep/50 hover:text-deep hover:border-deep/30'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-deep/10 flex items-center justify-center text-deep/50 hover:text-deep hover:border-deep/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      <ModalConfirmar
        turno={turnoConfirmar}
        isOpen={!!turnoConfirmar}
        onClose={() => setTurnoConfirmar(null)}
        onSuccess={handleSuccess}
      />
      <ModalRechazar
        turno={turnoRechazar}
        isOpen={!!turnoRechazar}
        onClose={() => setTurnoRechazar(null)}
        onSuccess={handleSuccess}
      />
    </PageWrapper>
  )
}
