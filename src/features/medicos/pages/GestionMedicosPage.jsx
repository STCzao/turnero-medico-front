import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { useMedicos } from '../hooks/useMedicos'

const PAGE_SIZE = 15

export default function GestionMedicosPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useMedicos({ page, pageSize: PAGE_SIZE })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Médicos</h1>
        <p className="text-deep/50 text-sm mt-1">Listado de médicos registrados en el sistema</p>
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
          <p className="text-sm">No hay médicos registrados</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {totalCount} médico{totalCount !== 1 ? 's' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            {/* Header tabla — solo desktop */}
            <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1.5fr] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Nombre</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Especialidad</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Email</span>
            </div>

            <AnimatePresence>
              {items.map((medico, idx) => (
                <motion.div
                  key={medico.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-4 flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1.5fr] md:items-center gap-1 md:gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                      <span className="text-teal text-xs font-bold">
                        {medico.nombre?.[0]}{medico.apellido?.[0]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-deep">
                      Dr. {medico.nombre} {medico.apellido}
                    </p>
                  </div>
                  <p className="text-sm text-deep/60">{medico.especialidadNombre ?? '—'}</p>
                  <p className="text-sm text-deep/50 truncate">{medico.email ?? '—'}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
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
    </PageWrapper>
  )
}
