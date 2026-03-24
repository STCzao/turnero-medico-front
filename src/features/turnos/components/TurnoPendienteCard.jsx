import { motion } from 'framer-motion'
import { formatFecha } from '../../../utils/formatFecha'

export default function TurnoPendienteCard({ turno, onConfirmar, onRechazar }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-deep/5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="mr-3">
          <p className="text-[11px] text-deep/40 uppercase tracking-widest font-semibold mb-0.5">
            {turno.especialidadNombre ?? 'Especialidad'}
          </p>
          <h3 className="text-deep font-bold text-base leading-tight">
            {turno.pacienteNombre ?? 'Paciente'}
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 shrink-0 whitespace-nowrap">
          Pendiente
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1.5 text-sm text-deep/55 flex-1">
        {/* Fecha de solicitud */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Solicitado el {formatFecha(turno.createdAt)}</span>
        </div>

        {/* Motivo */}
        {turno.motivo && (
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="line-clamp-2">{turno.motivo}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="mt-4 pt-4 border-t border-deep/5 flex gap-2">
        <button
          onClick={() => onConfirmar(turno)}
          className="flex-1 text-xs font-bold text-white bg-teal hover:bg-teal/90 px-4 py-2.5 rounded-xl transition-colors"
        >
          Confirmar
        </button>
        <button
          onClick={() => onRechazar(turno)}
          className="flex-1 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2.5 rounded-xl transition-colors"
        >
          Rechazar
        </button>
      </div>
    </motion.div>
  )
}
