import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useObrasSociales } from '../hooks/useObrasSociales'
import { obrasSocialesService } from '../services/obrasSocialesService'

const PAGE_SIZE = 15

export default function GestionObrasSocialesPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useObrasSociales({ page, pageSize: PAGE_SIZE })
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

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

  const openEditar = (os) => {
    setForm({ nombre: os.nombre })
    setFormError(null)
    setModal({ mode: 'editar', item: os })
  }

  const closeModal = () => setModal(null)

  const handleSubmit = async () => {
    const nombre = form.nombre.trim()
    if (!nombre) { setFormError('El nombre es obligatorio'); return }
    setSaving(true)
    try {
      if (modal.mode === 'crear') {
        await obrasSocialesService.crear({ nombre })
      } else {
        await obrasSocialesService.actualizar(modal.item.id, { nombre })
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
            <AnimatePresence>
              {items.map((os, idx) => (
                <motion.div
                  key={os.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-4 flex items-center justify-between gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <p className="text-sm font-semibold text-deep">{os.nombre}</p>
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
            onChange={e => { setForm({ nombre: e.target.value }); setFormError(null) }}
            error={formError}
            placeholder="Ej: OSDE"
            required
          />
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
