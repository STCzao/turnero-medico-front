import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { useDependientes } from '../hooks/usePacientes'
import { validate, rules } from '../../../utils/validators'

const EMPTY_FORM = {
  nombre: '', apellido: '', dni: '', fechaNacimiento: '', telefono: '',
}

const SCHEMA_CREATE = {
  nombre:          [rules.required('Ingresá el nombre')],
  apellido:        [rules.required('Ingresá el apellido')],
  dni:             [rules.required(), rules.dni()],
  fechaNacimiento: [rules.required('Ingresá la fecha de nacimiento')],
}

const SCHEMA_EDIT = {
  nombre:          [rules.required('Ingresá el nombre')],
  apellido:        [rules.required('Ingresá el apellido')],
  fechaNacimiento: [rules.required('Ingresá la fecha de nacimiento')],
}

function FormField({ label, error, children, required = true }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

function DependienteCard({ dep, onEdit, onDelete }) {
  const [confirmando, setConfirmando] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const edad = dep.fechaNacimiento
    ? Math.floor((Date.now() - new Date(dep.fechaNacimiento)) / 31557600000)
    : null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(dep.id)
    } finally {
      setDeleting(false)
      setConfirmando(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-4 border border-deep/5 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-deep/8 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-deep/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-deep font-bold text-sm">{dep.nombre} {dep.apellido}</p>
          <p className="text-deep/45 text-xs mt-0.5">
            DNI {dep.dni}
            {edad !== null && <span> · {edad} años</span>}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(dep)}
            className="p-2 rounded-lg text-deep/30 hover:text-teal hover:bg-teal/8 transition-colors"
            title="Editar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => setConfirmando(true)}
            className="p-2 rounded-lg text-deep/30 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {confirmando && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 flex-wrap pt-3 mt-3 border-t border-deep/5">
              <span className="text-xs text-deep/55 flex-1">¿Eliminar a {dep.nombre}?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-white bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-40"
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="text-xs text-deep/45 hover:text-deep/70 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DependientesPage() {
  const { dependientes, loading, error, crearDependiente, actualizarDependiente, eliminarDependiente } = useDependientes()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [editErrors, setEditErrors] = useState({})
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState(null)

  const inputClass = (field, errs = errors) =>
    `w-full bg-deep/5 border rounded-xl px-4 py-3 text-deep text-sm placeholder-deep/25 focus:outline-none transition-all ${
      errs[field] ? 'border-red-400/60 focus:border-red-400' : 'border-transparent focus:border-teal'
    }`

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  const setEdit = (field) => (e) => {
    setEditForm(f => ({ ...f, [field]: e.target.value }))
    setEditErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(SCHEMA_CREATE, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    setSaveError(null)
    try {
      await crearDependiente({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        fechaNacimiento: form.fechaNacimiento,
        ...(form.telefono && { telefono: form.telefono.trim() }),
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err) {
      const d = err.response?.data
      setSaveError(
        d?.message || d?.detail ||
        (d?.errors && Object.values(d.errors).flat()[0]) ||
        'No se pudo registrar el familiar'
      )
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (dep) => {
    setEditingId(dep.id)
    setEditForm({
      nombre: dep.nombre ?? '',
      apellido: dep.apellido ?? '',
      fechaNacimiento: dep.fechaNacimiento ? dep.fechaNacimiento.split('T')[0] : '',
      telefono: dep.telefono ?? '',
    })
    setEditErrors({})
    setEditError(null)
  }

  const handleEditSave = async () => {
    const errs = validate(SCHEMA_EDIT, editForm)
    if (Object.keys(errs).length) { setEditErrors(errs); return }
    setEditSaving(true)
    setEditError(null)
    try {
      await actualizarDependiente(editingId, {
        nombre: editForm.nombre.trim(),
        apellido: editForm.apellido.trim(),
        fechaNacimiento: editForm.fechaNacimiento,
        ...(editForm.telefono && { telefono: editForm.telefono.trim() }),
      })
      setEditingId(null)
      setEditForm(null)
    } catch (err) {
      const d = err.response?.data
      setEditError(
        d?.message || d?.detail ||
        (d?.errors && Object.values(d.errors).flat()[0]) ||
        'No se pudo actualizar el familiar'
      )
    } finally {
      setEditSaving(false)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
    setEditErrors({})
    setEditError(null)
  }

  return (
    <PageWrapper>
      <div className="w-full max-w-lg mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mis familiares</h1>
            <p className="text-deep/50 text-sm mt-1">
              Personas a tu cargo que gestionás vos sus turnos
            </p>
          </div>
          {!showForm && !editingId && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-deep text-mint font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-navy transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Formulario de creación */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                key="form-crear"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-4 md:p-6 border border-deep/5 shadow-sm space-y-4"
              >
                <h2 className="text-deep font-bold text-base">Nuevo familiar</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Nombre" error={errors.nombre}>
                    <input value={form.nombre} onChange={set('nombre')} placeholder="Juan" className={inputClass('nombre')} />
                  </FormField>
                  <FormField label="Apellido" error={errors.apellido}>
                    <input value={form.apellido} onChange={set('apellido')} placeholder="García" className={inputClass('apellido')} />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="DNI" error={errors.dni}>
                    <input value={form.dni} onChange={set('dni')} placeholder="12345678" maxLength={8} className={inputClass('dni')} />
                  </FormField>
                  <FormField label="Fecha de nacimiento" error={errors.fechaNacimiento}>
                    <input type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} className={inputClass('fechaNacimiento')} />
                  </FormField>
                </div>

                <FormField label="Teléfono" error={errors.telefono} required={false}>
                  <input value={form.telefono} onChange={set('telefono')} placeholder="1112345678" maxLength={20} className={inputClass('telefono')} />
                </FormField>

                {saveError && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{saveError}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-deep text-mint font-bold text-sm py-4 rounded-xl hover:bg-navy transition-colors disabled:opacity-40"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}) }}
                    className="px-5 text-sm font-medium text-deep/50 hover:text-deep transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Skeleton */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-20 bg-deep/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!loading && dependientes.length === 0 && !showForm && (
            <div className="text-center py-12 text-deep/30">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
              <p className="text-sm">Todavía no tenés familiares registrados</p>
            </div>
          )}

          {/* Lista */}
          <AnimatePresence mode="popLayout">
            {dependientes.map(dep => (
              editingId === dep.id ? (
                <motion.div
                  key={dep.id}
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="bg-white rounded-2xl p-4 md:p-6 border border-teal/20 shadow-sm space-y-4"
                >
                  <h2 className="text-deep font-bold text-base">Editar familiar</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Nombre" error={editErrors.nombre}>
                      <input value={editForm.nombre} onChange={setEdit('nombre')} placeholder="Juan" className={inputClass('nombre', editErrors)} />
                    </FormField>
                    <FormField label="Apellido" error={editErrors.apellido}>
                      <input value={editForm.apellido} onChange={setEdit('apellido')} placeholder="García" className={inputClass('apellido', editErrors)} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="DNI" required={false}>
                      <input value={dep.dni} disabled className="w-full bg-deep/5 border border-transparent rounded-xl px-4 py-3 text-deep/40 text-sm cursor-not-allowed" />
                    </FormField>
                    <FormField label="Fecha de nacimiento" error={editErrors.fechaNacimiento}>
                      <input type="date" value={editForm.fechaNacimiento} onChange={setEdit('fechaNacimiento')} className={inputClass('fechaNacimiento', editErrors)} />
                    </FormField>
                  </div>

                  <FormField label="Teléfono" required={false}>
                    <input value={editForm.telefono} onChange={setEdit('telefono')} placeholder="1112345678" maxLength={20} className={inputClass('telefono', editErrors)} />
                  </FormField>

                  {editError && (
                    <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{editError}</p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleEditSave}
                      disabled={editSaving}
                      className="flex-1 bg-deep text-mint font-bold text-sm py-4 rounded-xl hover:bg-navy transition-colors disabled:opacity-40"
                    >
                      {editSaving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-5 text-sm font-medium text-deep/50 hover:text-deep transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              ) : (
                <DependienteCard
                  key={dep.id}
                  dep={dep}
                  onEdit={startEdit}
                  onDelete={eliminarDependiente}
                />
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  )
}
