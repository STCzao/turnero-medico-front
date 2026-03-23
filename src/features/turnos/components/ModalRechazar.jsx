import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { useTurnoActions } from '../hooks/useTurnos'

export default function ModalRechazar({ turno, isOpen, onClose, onSuccess }) {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState(null)
  const { rechazar, loading } = useTurnoActions(onSuccess)

  const handleClose = () => {
    setMotivo('')
    setError(null)
    onClose()
  }

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      setError('El motivo de rechazo es obligatorio')
      return
    }
    try {
      await rechazar(turno.id, { motivo: motivo.trim() })
      handleClose()
    } catch {
      // el error ya lo maneja useTurnoActions
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Rechazar solicitud"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleSubmit} loading={loading}>
            Rechazar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Resumen del turno */}
        <div className="bg-deep/4 rounded-xl px-4 py-3 space-y-0.5">
          <p className="text-xs font-semibold text-deep/40 uppercase tracking-widest">
            {turno?.especialidadNombre}
          </p>
          <p className="text-sm font-bold text-deep">{turno?.pacienteNombre}</p>
          {turno?.motivo && (
            <p className="text-xs text-deep/50 line-clamp-2">{turno.motivo}</p>
          )}
        </div>

        {/* Motivo de rechazo */}
        <div>
          <label className="block text-xs font-semibold text-deep/60 mb-1.5">
            Motivo de rechazo <span className="text-red-500">*</span>
          </label>
          <textarea
            value={motivo}
            onChange={(e) => { setMotivo(e.target.value); setError(null) }}
            rows={3}
            placeholder="Ej: No hay disponibilidad para esa especialidad en las próximas semanas..."
            className={`w-full rounded-xl border px-3 py-2.5 text-sm text-deep placeholder:text-deep/30 resize-none outline-none transition-colors ${
              error
                ? 'border-red-400 focus:border-red-500'
                : 'border-deep/15 focus:border-deep/40'
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    </Modal>
  )
}
