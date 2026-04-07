import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useSecretarias } from '../../secretarias/hooks/useSecretarias'
import { secretariasService } from '../../secretarias/services/secretariasService'
import { authService } from '../../auth/services/authService'
import { validate, rules, NOMBRE_RULES, PASSWORD_RULES } from '../../../utils/validators'
import Pagination from '../../../components/ui/Pagination'

const PAGE_SIZE = 15
const FORM_CREAR_INICIAL = { nombre: '', apellido: '', dni: '', email: '', telefono: '', password: '' }
const SEC_CREAR_SCHEMA = {
  nombre:   NOMBRE_RULES,
  apellido: NOMBRE_RULES,
  dni:      [rules.required('El DNI es obligatorio'), rules.dni()],
  email:    [rules.required(), rules.email()],
  telefono: [rules.required(), rules.telefono()],
  password: PASSWORD_RULES,
}
const SEC_EDITAR_SCHEMA = {
  nombre:   NOMBRE_RULES,
  apellido: NOMBRE_RULES,
  email:    [rules.required(), rules.email()],
  telefono: [rules.required(), rules.telefono()],
}

export default function GestionSecretariasPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useSecretarias({ page, pageSize: PAGE_SIZE })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const [modal, setModal] = useState(null) // null | { mode: 'crear' | 'editar', item?: obj }
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState(FORM_CREAR_INICIAL)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openCrear = () => {
    setForm(FORM_CREAR_INICIAL)
    setFormError(null)
    setModal({ mode: 'crear' })
  }

  const openEditar = (sec) => {
    setForm({
      nombre: sec.nombre ?? '',
      apellido: sec.apellido ?? '',
      email: sec.email ?? '',
      telefono: sec.telefono ?? '',
    })
    setFormError(null)
    setModal({ mode: 'editar', item: sec })
  }

  const closeModal = () => setModal(null)

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFormError(null)
  }

  const handleSubmit = async () => {
    if (modal.mode === 'crear') {
      const errors = validate(SEC_CREAR_SCHEMA, form)
      if (Object.keys(errors).length) {
        setFormError(Object.values(errors)[0])
        return
      }
      setSaving(true)
      try {
        await authService.registerSecretaria({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          dni: form.dni.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
          password: form.password,
        })
        await refetch()
        closeModal()
      } catch (err) {
        setFormError(err.response?.data?.message || err.response?.data?.mensaje || 'Error al guardar')
      } finally {
        setSaving(false)
      }
    } else if (modal.mode === 'editar') {
      const errors = validate(SEC_EDITAR_SCHEMA, form)
      if (Object.keys(errors).length) {
        setFormError(Object.values(errors)[0])
        return
      }
      setSaving(true)
      try {
        await secretariasService.actualizar(modal.item.id, {
          id: modal.item.id,
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          email: form.email.trim(),
          telefono: form.telefono.trim(),
        })
        await refetch()
        closeModal()
      } catch (err) {
        setFormError(err.response?.data?.message || err.response?.data?.mensaje || 'Error al guardar')
      } finally {
        setSaving(false)
      }
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
            <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Nombre</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Email</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Teléfono</span>
              <span />
            </div>

            <AnimatePresence>
              {items.map((sec, idx) => (
                <motion.div
                  key={sec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-3.5 flex items-center gap-3 md:grid md:grid-cols-[1.5fr_1fr_1fr_auto] md:gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-sky/20 flex items-center justify-center shrink-0">
                      <span className="text-navy text-xs font-bold">
                        {sec.nombre?.[0]}{sec.apellido?.[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-deep truncate">
                        {sec.nombre} {sec.apellido}
                      </p>
                      <p className="text-xs text-deep/40">DNI {sec.dni ?? '—'}</p>
                    </div>
                  </div>

                  <p className="hidden md:block text-sm text-deep/50 truncate">{sec.email ?? '—'}</p>
                  <p className="hidden md:block text-sm text-deep/50">{sec.telefono || '—'}</p>

                  <div className="flex gap-2 shrink-0">
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
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Modal crear */}
      <Modal
        isOpen={modal?.mode === 'crear'}
        onClose={closeModal}
        title="Nueva secretaria"
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
              onChange={handleChange('nombre')}
              placeholder="Ej: María"
              required
            />
            <Input
              label="Apellido"
              id="apellido"
              value={form.apellido}
              onChange={handleChange('apellido')}
              placeholder="Ej: López"
              required
            />
          </div>
          <Input
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="Ej: secretaria@clinica.com"
            required
          />
          <Input
            label="Contraseña inicial"
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Mínimo 8 caracteres, mayúscula y número"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="DNI"
              id="dni"
              value={form.dni}
              onChange={handleChange('dni')}
              placeholder="Ej: 32456789"
              required
            />
            <Input
              label="Teléfono"
              id="telefono"
              value={form.telefono}
              onChange={handleChange('telefono')}
              placeholder="Ej: 11-1234-5678"
            />
          </div>
          {formError && <p className="text-xs text-red-500">{formError}</p>}
        </div>
      </Modal>

      {/* Modal editar */}
      <Modal
        isOpen={modal?.mode === 'editar'}
        onClose={closeModal}
        title="Editar secretaria"
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
              onChange={handleChange('nombre')}
              placeholder="Ej: María"
              required
            />
            <Input
              label="Apellido"
              id="apellido"
              value={form.apellido}
              onChange={handleChange('apellido')}
              placeholder="Ej: López"
              required
            />
          </div>
          <Input
            label="DNI"
            id="dni-readonly"
            value={modal?.item?.dni ?? ''}
            disabled
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="Ej: secretaria@clinica.com"
            required
          />
          <Input
            label="Teléfono"
            id="telefono"
            value={form.telefono}
            onChange={handleChange('telefono')}
            placeholder="Ej: 11-1234-5678"
          />
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
