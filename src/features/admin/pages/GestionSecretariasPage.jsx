import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useSecretarias } from '../../secretarias/hooks/useSecretarias'
import { secretariasService } from '../../secretarias/services/secretariasService'
import { authService } from '../../auth/services/authService'

const PAGE_SIZE = 15
const FORM_INICIAL = { nombre: '', apellido: '', email: '', password: '' }

export default function GestionSecretariasPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useSecretarias({ page, pageSize: PAGE_SIZE })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const [modal, setModal] = useState(null)       // null | { mode: 'crear' | 'editar', item?: obj }
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

  const openEditar = (sec) => {
    setForm({
      nombre: sec.nombre ?? '',
      apellido: sec.apellido ?? '',
      email: sec.email ?? '',
      password: '',
    })
    setFormError(null)
    setModal({ mode: 'editar', item: sec })
  }

  const closeModal = () => setModal(null)

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim()) {
      setFormError('Nombre, apellido y email son obligatorios')
      return
    }
    if (modal.mode === 'crear') {
      if (!form.password || form.password.length < 8) {
        setFormError('La contraseña debe tener al menos 8 caracteres')
        return
      }
      if (!/[A-Z]/.test(form.password)) {
        setFormError('La contraseña debe incluir al menos una letra mayúscula')
        return
      }
      if (!/[a-z]/.test(form.password)) {
        setFormError('La contraseña debe incluir al menos una letra minúscula')
        return
      }
      if (!/\d/.test(form.password)) {
        setFormError('La contraseña debe incluir al menos un número')
        return
      }
    }
    setSaving(true)
    try {
      if (modal.mode === 'crear') {
        await authService.registerSecretaria({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          email: form.email.trim(),
          password: form.password,
        })
      } else {
        await secretariasService.actualizar(modal.item.id, {
          id: modal.item.id,
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          email: form.email.trim(),
        })
      }
      await refetch()
      closeModal()
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data?.mensaje || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await secretariasService.eliminar(confirmDelete.id)
      await refetch()
      setConfirmDelete(null)
    } catch {
      // silencioso
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Secretarias</h1>
          <p className="text-deep/50 text-sm mt-1">Administrá las cuentas del personal de secretaría</p>
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
          <p className="text-sm">No hay secretarias registradas</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {totalCount} secretaria{totalCount !== 1 ? 's' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            <div className="hidden md:grid md:grid-cols-[1.5fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Nombre</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Email</span>
              <span />
            </div>

            <AnimatePresence>
              {items.map((sec, idx) => (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-4 flex flex-col md:grid md:grid-cols-[1.5fr_1.5fr_auto] md:items-center gap-1 md:gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky/20 flex items-center justify-center shrink-0">
                      <span className="text-navy text-xs font-bold">
                        {sec.nombre?.[0]}{sec.apellido?.[0]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-deep">
                      {sec.nombre} {sec.apellido}
                    </p>
                  </div>
                  <p className="text-sm text-deep/50 truncate">{sec.email ?? '—'}</p>
                  <div className="flex gap-2 shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => openEditar(sec)}
                      className="text-xs font-medium text-deep/50 hover:text-deep transition-colors px-2 py-1 rounded-lg hover:bg-deep/5"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(sec)}
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
        title={modal?.mode === 'crear' ? 'Nueva secretaria' : 'Editar secretaria'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSubmit} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre"
              id="nombre"
              value={form.nombre}
              onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); setFormError(null) }}
              placeholder="Ej: María"
              required
            />
            <Input
              label="Apellido"
              id="apellido"
              value={form.apellido}
              onChange={e => { setForm(f => ({ ...f, apellido: e.target.value })); setFormError(null) }}
              placeholder="Ej: López"
              required
            />
          </div>

          <Input
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormError(null) }}
            placeholder="Ej: secretaria@clinica.com"
            required
          />

          {modal?.mode === 'crear' && (
            <Input
              label="Contraseña inicial"
              id="password"
              type="password"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setFormError(null) }}
              placeholder="Mínimo 8 caracteres, mayúscula y número"
            />
          )}

          {formError && <p className="text-xs text-red-500">{formError}</p>}
        </div>
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar secretaria"
        message={`¿Eliminar a ${confirmDelete?.nombre} ${confirmDelete?.apellido}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
      />
    </PageWrapper>
  )
}
