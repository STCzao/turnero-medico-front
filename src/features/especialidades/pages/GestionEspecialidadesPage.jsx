import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useEspecialidades } from '../hooks/useEspecialidades'
import { especialidadesService } from '../services/especialidadesService'

export default function GestionEspecialidadesPage() {
  const { especialidades, loading, error, refetch } = useEspecialidades()

  const [modal, setModal] = useState(null)       // null | { mode: 'crear' | 'editar', item?: obj }
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ nombre: '' })
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openCrear = () => {
    setForm({ nombre: '' })
    setFormError(null)
    setModal({ mode: 'crear' })
  }

  const openEditar = (esp) => {
    setForm({ nombre: esp.nombre })
    setFormError(null)
    setModal({ mode: 'editar', item: esp })
  }

  const closeModal = () => setModal(null)

  const handleSubmit = async () => {
    const nombre = form.nombre.trim()
    if (!nombre) { setFormError('El nombre es obligatorio'); return }
    setSaving(true)
    try {
      if (modal.mode === 'crear') {
        await especialidadesService.crear({ nombre })
      } else {
        await especialidadesService.actualizar(modal.item.id, { nombre })
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
      await especialidadesService.eliminar(confirmDelete.id)
      await refetch()
      setConfirmDelete(null)
    } catch {
      // el backend puede rechazar si hay médicos asociados
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Especialidades</h1>
          <p className="text-deep/50 text-sm mt-1">Datos maestros del sistema</p>
        </div>
        <Button onClick={openCrear} size="sm">+ Nueva</Button>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
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
      {!loading && !error && especialidades.length === 0 && (
        <div className="text-center py-20 text-deep/30">
          <p className="text-sm">No hay especialidades registradas</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && especialidades.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {especialidades.length} especialidad{especialidades.length !== 1 ? 'es' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            <AnimatePresence>
              {especialidades.map((esp, idx) => (
                <motion.div
                  key={esp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-4 flex items-center justify-between gap-4 ${
                    idx < especialidades.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <p className="text-sm font-semibold text-deep">{esp.nombre}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEditar(esp)}
                      className="text-xs font-medium text-deep/50 hover:text-deep transition-colors px-2 py-1 rounded-lg hover:bg-deep/5"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(esp)}
                      className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Modal crear / editar */}
      <Modal
        isOpen={!!modal}
        onClose={closeModal}
        title={modal?.mode === 'crear' ? 'Nueva especialidad' : 'Editar especialidad'}
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
            onChange={e => { setForm({ nombre: e.target.value }); setFormError(null) }}
            error={formError}
            placeholder="Ej: Cardiología"
            required
          />
        </div>
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar especialidad"
        message={`¿Eliminar "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
      />
    </PageWrapper>
  )
}
