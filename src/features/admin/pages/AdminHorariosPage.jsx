import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { useMedicos } from '../../medicos/hooks/useMedicos'
import { horariosService } from '../services/horariosService'

const DIAS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
]

const FORM_INICIAL = { diaSemana: '1', horaInicio: '08:00', horaFin: '17:00', intervaloMinutos: '30' }

export default function AdminHorariosPage() {
  const { items: medicos = [], loading: loadingMedicos } = useMedicos({ page: 1, pageSize: 100 })
  const [doctorId, setDoctorId] = useState('')

  const [horarios, setHorarios] = useState([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [errorHorarios, setErrorHorarios] = useState(null)

  const [modalAgregar, setModalAgregar] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchHorarios = useCallback(async () => {
    if (!doctorId) return
    setLoadingHorarios(true)
    setErrorHorarios(null)
    try {
      const { data } = await horariosService.getByDoctor(doctorId)
      setHorarios(Array.isArray(data) ? data : (data?.items ?? []))
    } catch {
      setErrorHorarios('Error al cargar horarios')
    } finally {
      setLoadingHorarios(false)
    }
  }, [doctorId])

  useEffect(() => { fetchHorarios() }, [fetchHorarios])

  const openAgregar = () => {
    setForm(FORM_INICIAL)
    setFormError(null)
    setModalAgregar(true)
  }

  const handleSubmit = async () => {
    if (!doctorId) return
    setSaving(true)
    try {
      await horariosService.crear({
        doctorId:        Number(doctorId),
        diaSemana:       Number(form.diaSemana),
        horaInicio:      form.horaInicio + ':00',
        horaFin:         form.horaFin + ':00',
        duracionMinutos: Number(form.intervaloMinutos),
      })
      await fetchHorarios()
      setModalAgregar(false)
    } catch (err) {
      setFormError(err.response?.data?.mensaje || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await horariosService.eliminar(confirmDelete.id)
      await fetchHorarios()
      setConfirmDelete(null)
    } catch {
      // silencioso
    } finally {
      setDeleting(false)
    }
  }

  const labelDia = (v) => DIAS.find(d => d.value === v)?.label ?? v

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Horarios de médicos</h1>
        <p className="text-deep/50 text-sm mt-1">Configurá la disponibilidad semanal de cada médico</p>
      </div>

      {/* Selector de médico */}
      <div className="bg-white rounded-2xl border border-deep/5 shadow-sm p-5 mb-6">
        <label className="text-sm font-medium text-navy block mb-2">Médico</label>
        {loadingMedicos ? (
          <div className="h-10 bg-deep/5 rounded-lg animate-pulse" />
        ) : (
          <select
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors"
          >
            <option value="">— Seleccioná un médico —</option>
            {medicos.map(m => (
              <option key={m.id} value={m.id}>
                Dr. {m.nombre} {m.apellido} — {m.especialidadNombre ?? 'Sin especialidad'}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Horarios del médico seleccionado */}
      {doctorId && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-deep">Horarios configurados</p>
            <Button onClick={openAgregar} size="sm">+ Agregar</Button>
          </div>

          {/* Skeleton */}
          {loadingHorarios && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-deep/5" />
              ))}
            </div>
          )}

          {/* Error */}
          {errorHorarios && !loadingHorarios && (
            <div className="text-center py-10">
              <p className="text-red-500 text-sm">{errorHorarios}</p>
              <button onClick={fetchHorarios} className="mt-2 text-xs text-deep/50 hover:text-deep underline">
                Reintentar
              </button>
            </div>
          )}

          {/* Vacío */}
          {!loadingHorarios && !errorHorarios && horarios.length === 0 && (
            <div className="text-center py-14 text-deep/30">
              <p className="text-sm">Este médico no tiene horarios configurados</p>
            </div>
          )}

          {/* Tabla */}
          {!loadingHorarios && !errorHorarios && horarios.length > 0 && (
            <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
              {/* Header — desktop */}
              <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
                <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Día</span>
                <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Desde</span>
                <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Hasta</span>
                <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Intervalo</span>
                <span />
              </div>

              <AnimatePresence>
                {horarios.map((h, idx) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`px-5 py-4 flex flex-col md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-center gap-1 md:gap-4 ${
                      idx < horarios.length - 1 ? 'border-b border-deep/5' : ''
                    }`}
                  >
                    <p className="text-sm font-semibold text-deep">{labelDia(h.diaSemana)}</p>
                    <p className="text-sm text-deep/60">{h.horaInicio}</p>
                    <p className="text-sm text-deep/60">{h.horaFin}</p>
                    <p className="text-sm text-deep/50">{h.duracionMinutos} min</p>
                    <button
                      onClick={() => setConfirmDelete(h)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 self-start md:self-auto"
                    >
                      Eliminar
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Modal agregar horario */}
      <Modal
        isOpen={modalAgregar}
        onClose={() => setModalAgregar(false)}
        title="Agregar horario"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalAgregar(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {/* Día */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy">Día de la semana</label>
            <select
              value={form.diaSemana}
              onChange={e => setForm(f => ({ ...f, diaSemana: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors"
            >
              {DIAS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Hora inicio / fin */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-navy">Desde</label>
              <input
                type="time"
                value={form.horaInicio}
                onChange={e => setForm(f => ({ ...f, horaInicio: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-navy">Hasta</label>
              <input
                type="time"
                value={form.horaFin}
                onChange={e => setForm(f => ({ ...f, horaFin: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors"
              />
            </div>
          </div>

          {/* Intervalo */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy">Intervalo entre turnos (minutos)</label>
            <input
              type="number"
              min="10"
              max="120"
              step="5"
              value={form.intervaloMinutos}
              onChange={e => setForm(f => ({ ...f, intervaloMinutos: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors"
            />
          </div>

          {formError && <p className="text-xs text-red-500">{formError}</p>}
        </div>
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar horario"
        message={`¿Eliminar el horario del ${confirmDelete ? labelDia(confirmDelete.diaSemana) : ''} de ${confirmDelete?.horaInicio} a ${confirmDelete?.horaFin}?`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
      />
    </PageWrapper>
  )
}
