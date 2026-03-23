import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Badge from '../../../components/ui/Badge'
import { useAgendaDoctor, useTurnoActions } from '../hooks/useTurnos'
import { ESTADO_TURNO } from '../../../constants/estadosTurno'
import { formatHora, toISODate } from '../../../utils/formatFecha'

const HOY = toISODate(new Date())

function NavFecha({ fecha, onPrev, onNext }) {
  const label = fecha === HOY
    ? 'Hoy'
    : new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="flex items-center gap-3">
      <button onClick={onPrev} className="w-8 h-8 rounded-full bg-white border border-deep/10 flex items-center justify-center hover:bg-deep/5 transition-colors">
        <svg className="w-4 h-4 text-deep/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="font-bold text-deep capitalize min-w-[180px] text-center">{label}</span>
      <button onClick={onNext} className="w-8 h-8 rounded-full bg-white border border-deep/10 flex items-center justify-center hover:bg-deep/5 transition-colors">
        <svg className="w-4 h-4 text-deep/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function TurnoAgendaRow({ turno, onAction, actionLoading }) {
  const [accion, setAccion] = useState(null) // 'completado' | 'ausente'

  const puedeActuar = turno.estado === ESTADO_TURNO.CONFIRMADO

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 border border-deep/5 flex flex-col sm:flex-row sm:items-center gap-3"
    >
      {/* Hora */}
      <div className="shrink-0 w-16 text-center">
        <p className="text-deep font-black text-lg leading-none">{formatHora(turno.fechaHora)}</p>
      </div>

      {/* Info paciente */}
      <div className="flex-1 min-w-0">
        <p className="text-deep font-bold text-sm truncate">
          {turno.pacienteNombre || "Paciente desconocido"}
        </p>
        {turno.motivo && (
          <p className="text-deep/45 text-xs mt-0.5 line-clamp-1">{turno.motivo}</p>
        )}
      </div>

      {/* Badge */}
      <Badge estado={turno.estado} />

      {/* Acciones del doctor (solo confirmados) */}
      {puedeActuar && (
        <AnimatePresence mode="wait">
          {!accion ? (
            <motion.div key="btns" className="flex gap-2 shrink-0">
              <button
                onClick={() => setAccion('completado')}
                className="text-xs font-semibold bg-teal/10 text-teal hover:bg-teal/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Completado
              </button>
              <button
                onClick={() => setAccion('ausente')}
                className="text-xs font-semibold bg-deep/5 text-deep/50 hover:bg-deep/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ausente
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 shrink-0 flex-wrap"
            >
              <span className="text-xs text-deep/50">
                ¿Marcar como <strong>{accion === 'completado' ? 'Completado' : 'Ausente'}</strong>?
              </span>
              <button
                disabled={actionLoading}
                onClick={() => { onAction(turno.id, accion); setAccion(null) }}
                className="text-xs font-semibold bg-deep text-mint px-3 py-1.5 rounded-lg hover:bg-navy transition-colors disabled:opacity-40"
              >
                Confirmar
              </button>
              <button
                onClick={() => setAccion(null)}
                className="text-xs text-deep/40 hover:text-deep/60 transition-colors"
              >
                Cancelar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export default function MiAgendaPage() {
  const [fecha, setFecha] = useState(HOY)

  const moverDia = (dias) => {
    const d = new Date(fecha + 'T00:00:00')
    d.setDate(d.getDate() + dias)
    setFecha(toISODate(d))
  }

  const { turnos, loading, error, refetch } = useAgendaDoctor(fecha)
  const { actualizar, loading: actionLoading } = useTurnoActions(refetch)

  const handleAction = (id, estado) => {
    actualizar(id, { estado: estado === 'completado' ? ESTADO_TURNO.COMPLETADO : ESTADO_TURNO.AUSENTE })
  }

  const confirmados = turnos.filter(t => t.estado === ESTADO_TURNO.CONFIRMADO)
  const resto       = turnos.filter(t => t.estado !== ESTADO_TURNO.CONFIRMADO)

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mi Agenda</h1>
          <p className="text-deep/50 text-sm mt-1">{turnos.length} turno{turnos.length !== 1 ? 's' : ''} para este día</p>
        </div>
        <NavFecha fecha={fecha} onPrev={() => moverDia(-1)} onNext={() => moverDia(1)} />
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-16 animate-pulse border border-deep/5" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={refetch} className="mt-3 text-xs text-deep/50 hover:text-deep underline">Reintentar</button>
        </div>
      )}

      {/* Vacío */}
      {!loading && !error && turnos.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <p className="text-deep font-bold text-lg">Sin turnos para este día</p>
          <p className="text-deep/40 text-sm mt-1">No tenés pacientes agendados</p>
        </motion.div>
      )}

      {/* Turnos del día */}
      {!loading && !error && turnos.length > 0 && (
        <div className="space-y-6">
          {confirmados.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-3">Próximos</h2>
              <div className="space-y-2">
                <AnimatePresence>
                  {confirmados.map(t => (
                    <TurnoAgendaRow key={t.id} turno={t} onAction={handleAction} actionLoading={actionLoading} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
          {resto.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-3">Finalizados</h2>
              <div className="space-y-2">
                {resto.map(t => (
                  <TurnoAgendaRow key={t.id} turno={t} onAction={handleAction} actionLoading={actionLoading} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageWrapper>
  )
}
