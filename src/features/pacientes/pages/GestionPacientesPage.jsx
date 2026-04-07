import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { usePacientesPaginados } from '../hooks/usePacientes'
import { calcularEdad } from '../../../utils/formatFecha'
import Pagination from '../../../components/ui/Pagination'

const PAGE_SIZE = 15

export default function GestionPacientesPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = usePacientesPaginados({ page, pageSize: PAGE_SIZE })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Pacientes</h1>
        <p className="text-deep/50 text-sm mt-1">Listado de pacientes registrados en el sistema</p>
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
          <p className="text-sm">No hay pacientes registrados</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {totalCount} paciente{totalCount !== 1 ? 's' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            {/* Header tabla — solo desktop */}
            <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Nombre</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">DNI</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Email</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Edad</span>
            </div>

            <AnimatePresence>
              {items.map((paciente, idx) => {
                const edad = calcularEdad(paciente.fechaNacimiento)
                return (
                  <motion.div
                    key={paciente.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`px-5 py-4 flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr] md:items-center gap-1 md:gap-4 ${
                      idx < items.length - 1 ? 'border-b border-deep/5' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-deep">
                        {paciente.nombre} {paciente.apellido}
                      </p>
                      {paciente.telefono && (
                        <p className="text-xs text-deep/40 mt-0.5 md:hidden">{paciente.telefono}</p>
                      )}
                    </div>
                    <p className="text-sm text-deep/60">{paciente.dni ?? '—'}</p>
                    <p className="text-sm text-deep/60 truncate">{paciente.email ?? '—'}</p>
                    <p className="text-sm text-deep/50">
                      {edad !== null ? `${edad} años` : '—'}
                    </p>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Paginación */}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </PageWrapper>
  )
}
