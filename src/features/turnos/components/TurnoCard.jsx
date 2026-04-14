import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../../../components/ui/Badge";
import { ESTADO_TURNO } from "../../../constants/estadosTurno";
import { formatFechaHora } from "../../../utils/formatFecha";

const CANCELABLES = [ESTADO_TURNO.SOLICITUD_PENDIENTE, ESTADO_TURNO.CONFIRMADO];

export default function TurnoCard({ turno, onCancel, cancelLoading, pacienteNombre }) {
  const [confirmando, setConfirmando] = useState(false);
  const canCancel = CANCELABLES.includes(turno.estado);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-deep/5 flex flex-col active:scale-[0.995]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="mr-3">
          {pacienteNombre && (
            <p className="text-[10px] font-bold text-teal uppercase tracking-widest mb-0.5">
              {pacienteNombre}
            </p>
          )}
          <p className="text-[11px] text-deep/40 uppercase tracking-widest font-semibold mb-0.5">
            {turno.especialidadNombre ?? "Especialidad"}
          </p>
          <h3 className="text-deep font-bold text-base leading-tight">
            {turno.doctorNombre || "Médico por asignar"}
          </h3>
        </div>
        <Badge estado={turno.estado} />
      </div>

      {/* Info */}
      <div className="space-y-1.5 text-sm text-deep/55 flex-1">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatFechaHora(turno.fechaHora)}</span>
        </div>

        {turno.motivo && (
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="line-clamp-2">{turno.motivo}</span>
          </div>
        )}

        {turno.obraSocialNombre && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              {turno.obraSocialNombre}
              {turno.numeroAfiliadoDeclarado && ` · ${turno.numeroAfiliadoDeclarado}`}
              {turno.planAfiliadoDeclarado && ` · ${turno.planAfiliadoDeclarado}`}
            </span>
          </div>
        )}

        {turno.motivoRechazo && (
          <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2 mt-2">
            Rechazado: {turno.motivoRechazo}
          </p>
        )}
      </div>

      {/* Cancelar */}
      {canCancel && (
        <div className="mt-4 pt-4 border-t border-deep/5">
          <AnimatePresence mode="wait">
            {!confirmando ? (
              <motion.button
                key="cancel-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmando(true)}
                className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
              >
                Cancelar turno
              </motion.button>
            ) : (
              <motion.div
                key="cancel-confirm"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <span className="text-xs text-deep/55">
                  ¿Confirmás la cancelación?
                </span>
                <button
                  onClick={() => {
                    onCancel(turno.id);
                    setConfirmando(false);
                  }}
                  disabled={cancelLoading}
                  className="text-xs text-white bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-40"
                >
                  Sí, cancelar
                </button>
                <button
                  onClick={() => setConfirmando(false)}
                  className="text-xs text-deep/45 hover:text-deep/70 font-medium transition-colors"
                >
                  No
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
