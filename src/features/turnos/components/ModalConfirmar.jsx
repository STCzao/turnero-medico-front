import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { useTurnoActions } from '../hooks/useTurnos'
import { useMedicosByEspecialidad, useDisponibilidad } from '../../medicos/hooks/useMedicos'

export default function ModalConfirmar({ turno, isOpen, onClose, onSuccess }) {
  const [doctorId, setDoctorId] = useState('')
  const [fecha, setFecha] = useState('')
  const [slot, setSlot] = useState('')

  const { confirmar, loading, error: submitError } = useTurnoActions(onSuccess)
  const { medicos, loading: loadingMedicos } = useMedicosByEspecialidad(turno?.especialidadNombre)
  const { slots, loading: loadingSlots } = useDisponibilidad(
    doctorId || null,
    fecha || null
  )

  const handleClose = () => {
    setDoctorId('')
    setFecha('')
    setSlot('')
    onClose()
  }

  const handleSubmit = async () => {
    const slotStr = typeof slot === 'string' ? slot : slot?.hora ?? slot?.hora ?? ''
    const fechaHora = `${fecha}T${slotStr.length === 5 ? slotStr + ':00' : slotStr}`
    try {
      await confirmar(turno.id, { doctorId: Number(doctorId), fechaHora })
      handleClose()
    } catch {
      // el error ya lo maneja useTurnoActions
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const canSubmit = doctorId && fecha && slot

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Confirmar turno"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!canSubmit}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <div className="space-y-5">
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

        {/* Doctor */}
        <div>
          <label className="block text-xs font-semibold text-deep/60 mb-1.5">
            Médico asignado <span className="text-red-500">*</span>
          </label>
          {loadingMedicos ? (
            <div className="h-10 bg-deep/5 rounded-xl animate-pulse" />
          ) : medicos.length === 0 ? (
            <p className="text-xs text-deep/40 italic">
              No hay médicos disponibles para {turno?.especialidadNombre}
            </p>
          ) : (
            <select
              value={doctorId}
              onChange={(e) => { setDoctorId(e.target.value); setFecha(''); setSlot('') }}
              className="w-full rounded-xl border border-deep/15 focus:border-deep/40 px-3 py-2.5 text-sm text-deep outline-none transition-colors bg-white appearance-none"
            >
              <option value="">Seleccioná un médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  Dr. {m.nombre} {m.apellido}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Fecha — solo si hay doctor */}
        {doctorId && (
          <div>
            <label className="block text-xs font-semibold text-deep/60 mb-1.5">
              Fecha del turno <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              min={today}
              onChange={(e) => { setFecha(e.target.value); setSlot('') }}
              className="w-full rounded-xl border border-deep/15 focus:border-deep/40 px-3 py-2.5 text-sm text-deep outline-none transition-colors"
            />
          </div>
        )}

        {/* Horarios — solo si hay fecha */}
        {doctorId && fecha && (
          <div>
            <label className="block text-xs font-semibold text-deep/60 mb-1.5">
              Horario <span className="text-red-500">*</span>
            </label>
            {loadingSlots ? (
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 bg-deep/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-xs text-deep/40 italic">
                Sin disponibilidad para esa fecha
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {slots.map((s) => {
                  const valor = typeof s === 'string' ? s : (s?.hora ?? s?.time ?? '')
                  const isSelected = slot === s
                  return (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-deep text-mint border-deep'
                          : 'bg-deep/5 text-deep/70 border-transparent hover:bg-deep/10 hover:text-deep'
                      }`}
                    >
                      {valor}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Error de submit */}
        {submitError && (
          <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {submitError}
          </p>
        )}
      </div>
    </Modal>
  )
}
