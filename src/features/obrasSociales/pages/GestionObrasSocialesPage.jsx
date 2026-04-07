import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useObrasSociales } from '../hooks/useObrasSociales'
import { obrasSocialesService } from '../services/obrasSocialesService'
import Pagination from '../../../components/ui/Pagination'
import { useEspecialidades } from '../../especialidades/hooks/useEspecialidades'

const PAGE_SIZE = 15
const FORM_INICIAL = { nombre: '', especialidadIds: [], planes: [], observaciones: '' }

export default function GestionObrasSocialesPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useObrasSociales({ page, pageSize: PAGE_SIZE })
  const { especialidades } = useEspecialidades()
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const [modal, setModal] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openCrear = () => {
    setForm(FORM_INICIAL)
    setFormError(null)
    setModal({ mode: 'crear' })
  }

  const openEditar = (os) => {
    setForm({
      nombre: os.nombre ?? '',
      especialidadIds: os.especialidades?.map(e => e.id) ?? [],
      planes: os.planes ?? [],
      observaciones: os.observaciones ?? '',
    })
    setFormError(null)
    setModal({ mode: 'editar', item: os })
  }

  const closeModal = () => setModal(null)

  const toggleEspecialidad = (id) => {
    setForm(f => ({
      ...f,
      especialidadIds: f.especialidadIds.includes(id)
        ? f.especialidadIds.filter(x => x !== id)
        : [...f.especialidadIds, id],
    }))
    setFormError(null)
  }

  const handleSubmit = async () => {
    const nombre = form.nombre.trim()
    if (!nombre) { setFormError('El nombre es obligatorio'); return }
    if (form.especialidadIds.length === 0) { setFormError('Seleccioná al menos una especialidad'); return }
    setSaving(true)
    try {
      const payload = {
        nombre,
        especialidadIds: form.especialidadIds,
        planes: form.planes,
        observaciones: form.observaciones.trim(),
      }
      if (modal.mode === 'crear') {
        await obrasSocialesService.crear(payload)
      } else {
        await obrasSocialesService.actualizar(modal.item.id, payload)
      }
      await refetch()
      closeModal()
    } catch (err) {
      setFormError(err.response?.data?.mensaje || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await obrasSocialesService.eliminar(confirmDelete.id)
      await refetch()
      setConfirmDelete(null)
    } catch {
      // el backend puede rechazar si hay pacientes asociados
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Obras Sociales</h1>
          <p className="text-deep/50 text-sm mt-1">Datos maestros del sistema</p>
        </div>
        <Button onClick={openCrear} size="sm">+ Nueva</Button>
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
          <p className="text-sm">No hay obras sociales registradas</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {totalCount} obra{totalCount !== 1 ? 's' : ''} social{totalCount !== 1 ? 'es' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            {/* Header tabla — solo desktop */}
            <div className="hidden md:grid md:grid-cols-[2fr_1fr_auto] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Nombre</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Especialidades</span>
              <span />
            </div>

            <AnimatePresence>
              {items.map((os, idx) => (
                <motion.div
                  key={os.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-3.5 flex items-center gap-3 md:grid md:grid-cols-[2fr_1fr_auto] md:gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-deep truncate">{os.nombre}</p>
                    <p className="text-xs text-deep/40 truncate md:hidden">
                      {os.especialidades?.map(e => e.nombre).join(', ') || '—'}
                    </p>
                  </div>
                  <p className="hidden md:block text-xs text-deep/50">
                    {os.especialidades?.map(e => e.nombre).join(', ') || '—'}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEditar(os)}
                      className="text-xs font-medium text-deep/50 hover:text-deep transition-colors px-2 py-1 rounded-lg hover:bg-deep/5"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(os)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Paginación */}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Modal crear / editar */}
      <Modal
        isOpen={!!modal}
        onClose={closeModal}
        title={modal?.mode === 'crear' ? 'Nueva obra social' : 'Editar obra social'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nombre"
            id="nombre"
            value={form.nombre}
            onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); setFormError(null) }}
            placeholder="Ej: OSDE"
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-navy">
              Especialidades cubiertas <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {especialidades.map(esp => {
                const checked = form.especialidadIds.includes(esp.id)
                return (
                  <button
                    key={esp.id}
                    type="button"
                    onClick={() => toggleEspecialidad(esp.id)}
                    className={`text-left text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                      checked
                        ? 'bg-deep text-mint border-deep'
                        : 'bg-deep/5 text-deep/70 border-transparent hover:bg-deep/10 hover:text-deep'
                    }`}
                  >
                    {esp.nombre}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy">Observaciones <span className="text-deep/30 font-normal">(opcional)</span></label>
            <textarea
              value={form.observaciones}
              onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
              placeholder="Copagos, restricciones, condiciones especiales..."
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors resize-none"
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
        title="Eliminar obra social"
        message={`¿Eliminar "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
      />
    </PageWrapper>
  )
}
