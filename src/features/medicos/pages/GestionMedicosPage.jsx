import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import Modal, { ConfirmModal } from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { useMedicos } from '../hooks/useMedicos'
import { medicosService } from '../services/medicosService'
import { authService } from '../../auth/services/authService'
import { useEspecialidades } from '../../especialidades/hooks/useEspecialidades'
import { validate, rules, NOMBRE_RULES, PASSWORD_RULES, EMAIL_RULES } from '../../../utils/validators'
import Pagination from '../../../components/ui/Pagination'

const PAGE_SIZE = 15
const FORM_INICIAL = { nombre: '', apellido: '', dni: '', email: '', password: '', matricula: '', telefono: '', especialidadId: '' }
const MEDICO_CREAR_SCHEMA = {
  nombre:         NOMBRE_RULES,
  apellido:       NOMBRE_RULES,
  dni:            [rules.required('El DNI es obligatorio'), rules.dni()],
  email:          EMAIL_RULES,
  matricula:      [rules.required('La matrícula es obligatoria'), rules.minLength(5, 'Mínimo 5 caracteres'), rules.maxLength(15, 'Máximo 15 caracteres'), rules.pattern(/^[A-Za-z0-9]+$/, 'Solo letras y números, sin espacios ni guiones')],
  telefono:       [rules.required(), rules.telefono()],
  especialidadId: [rules.required('Seleccioná una especialidad')],
  password:       PASSWORD_RULES,
}
const MEDICO_EDITAR_SCHEMA = {
  nombre:         NOMBRE_RULES,
  apellido:       NOMBRE_RULES,
  telefono:       [rules.required(), rules.telefono()],
  especialidadId: [rules.required('Seleccioná una especialidad')],
}

export default function GestionMedicosPage() {
  const [page, setPage] = useState(1)
  const { items = [], totalCount = 0, loading, error, refetch } = useMedicos({ page, pageSize: PAGE_SIZE })
  const { especialidades } = useEspecialidades()

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const [modal, setModal] = useState(null)       // null | { mode: 'crear' | 'editar', item?: obj }
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [formError, setFormError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const openCrear = () => {
    setForm(FORM_INICIAL)
    setFormError(null)
    setModal({ mode: 'crear' })
  }

  const openEditar = (medico) => {
    setForm({
      nombre: medico.nombre ?? '',
      apellido: medico.apellido ?? '',
      dni: medico.dni ?? '',
      email: medico.email ?? '',
      password: '',
      matricula: medico.matricula ?? '',
      telefono: medico.telefono ?? '',
      especialidadId: medico.especialidadId != null ? String(medico.especialidadId) : '',
    })
    setFormError(null)
    setModal({ mode: 'editar', item: medico })
  }

  const closeModal = () => setModal(null)

  const handleSubmit = async () => {
    const schema = modal.mode === 'crear' ? MEDICO_CREAR_SCHEMA : MEDICO_EDITAR_SCHEMA
    const errors = validate(schema, form)
    if (Object.keys(errors).length) {
      setFormError(Object.values(errors)[0])
      return
    }
    setSaving(true)
    try {
      if (modal.mode === 'crear') {
        await authService.registerDoctor({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          dni: form.dni.trim(),
          email: form.email.trim(),
          password: form.password,
          matricula: form.matricula.trim(),
          telefono: form.telefono.trim(),
          especialidadId: Number(form.especialidadId),
        })
      } else {
        await medicosService.actualizar(modal.item.id, {
          id: modal.item.id,
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          telefono: form.telefono.trim(),
          especialidadId: Number(form.especialidadId),
        })
      }
      await refetch()
      closeModal()
    } catch (err) {
      setFormError(err.response?.data?.mensaje || err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      await medicosService.eliminar(confirmDelete.id)
      await refetch()
      setConfirmDelete(null)
    } catch (err) {
      setDeleteError(err.response?.data?.mensaje || 'No se pudo eliminar al médico')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Médicos</h1>
          <p className="text-deep/50 text-sm mt-1">Listado de médicos registrados en el sistema</p>
        </div>
        <Button onClick={openCrear} size="sm">+ Nuevo</Button>
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
          <p className="text-sm">No hay médicos registrados</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && items.length > 0 && (
        <>
          <p className="text-xs text-deep/40 mb-3">
            {totalCount} médico{totalCount !== 1 ? 's' : ''}
          </p>

          <div className="bg-white rounded-2xl border border-deep/5 shadow-sm overflow-hidden">
            {/* Header tabla — solo desktop */}
            <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-deep/5 bg-deep/[0.02]">
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Nombre</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Especialidad</span>
              <span className="text-[10px] font-bold text-deep/40 uppercase tracking-widest">Email</span>
              <span />
            </div>

            <AnimatePresence>
              {items.map((medico, idx) => (
                <motion.div
                  key={medico.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-5 py-3.5 flex items-center gap-3 md:grid md:grid-cols-[1.5fr_1fr_1.5fr_auto] md:gap-4 ${
                    idx < items.length - 1 ? 'border-b border-deep/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                      <span className="text-teal text-xs font-bold">
                        {medico.nombre?.[0]}{medico.apellido?.[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-deep truncate">
                        Dr. {medico.nombre} {medico.apellido}
                      </p>
                      <p className="text-xs text-deep/40 truncate md:hidden">{medico.especialidadNombre ?? '—'}</p>
                    </div>
                  </div>
                  <p className="hidden md:block text-sm text-deep/60">{medico.especialidadNombre ?? '—'}</p>
                  <p className="hidden md:block text-sm text-deep/50 truncate">{medico.email ?? '—'}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEditar(medico)}
                      className="text-xs font-medium text-deep/50 hover:text-deep transition-colors px-2 py-1 rounded-lg hover:bg-deep/5"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(medico)}
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
        title={modal?.mode === 'crear' ? 'Nuevo médico' : 'Editar médico'}
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
              placeholder="Ej: Juan"
              required
            />
            <Input
              label="Apellido"
              id="apellido"
              value={form.apellido}
              onChange={e => { setForm(f => ({ ...f, apellido: e.target.value })); setFormError(null) }}
              placeholder="Ej: García"
              required
            />
          </div>

          <Input
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormError(null) }}
            placeholder="Ej: doctor@clinica.com"
            required
            disabled={modal?.mode === 'editar'}
          />

          {modal?.mode === 'crear' && (
            <Input
              label="Contraseña inicial"
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Mínimo 8 caracteres"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="DNI"
              id="dni"
              value={form.dni}
              onChange={e => { setForm(f => ({ ...f, dni: e.target.value })); setFormError(null) }}
              placeholder="Ej: 32456789"
              required={modal?.mode === 'crear'}
              disabled={modal?.mode === 'editar'}
            />
            <Input
              label="Matrícula"
              id="matricula"
              value={form.matricula}
              onChange={e => { setForm(f => ({ ...f, matricula: e.target.value })); setFormError(null) }}
              placeholder="Ej: MP12345"
              required
              disabled={modal?.mode === 'editar'}
            />
          </div>
          <Input
            label="Teléfono"
            id="telefono"
            value={form.telefono}
            onChange={e => { setForm(f => ({ ...f, telefono: e.target.value })); setFormError(null) }}
            placeholder="Ej: 1122334455"
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy">Especialidad</label>
            <select
              value={form.especialidadId}
              onChange={e => setForm(f => ({ ...f, especialidadId: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy bg-white outline-none focus:border-deep focus:ring-2 focus:ring-deep/20 transition-colors"
            >
              <option value="">— Sin especialidad —</option>
              {especialidades.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          {formError && <p className="text-xs text-red-500">{formError}</p>}
        </div>
      </Modal>

      {/* Confirm eliminar */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => { setConfirmDelete(null); setDeleteError(null) }}
        onConfirm={handleDelete}
        title="Eliminar médico"
        message={deleteError ?? `¿Eliminar al Dr. ${confirmDelete?.nombre} ${confirmDelete?.apellido}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
      />
    </PageWrapper>
  )
}
