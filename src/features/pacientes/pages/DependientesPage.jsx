import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { useDependientes } from '../hooks/usePacientes'
import { validate, rules } from '../../../utils/validators'

const EMPTY_FORM = { nombre: '', apellido: '', dni: '', fechaNacimiento: '' }

const SCHEMA = {
  nombre:          [rules.required('Ingresá el nombre')],
  apellido:        [rules.required('Ingresá el apellido')],
  dni:             [rules.required(), rules.dni()],
  fechaNacimiento: [rules.required('Ingresá la fecha de nacimiento')],
}

function DependienteCard({ dep }) {
  const edad = dep.fechaNacimiento
    ? Math.floor((Date.now() - new Date(dep.fechaNacimiento)) / 31557600000)
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-4 border border-deep/5 shadow-sm flex items-center gap-4"
    >
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
    </motion.div>
  )
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
        {label} <span className="text-red-400">*</span>
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

export default function DependientesPage() {
  const { dependientes, loading, error, crearDependiente } = useDependientes()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(SCHEMA, form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    setSaveError(null)
    try {
      await crearDependiente({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        fechaNacimiento: form.fechaNacimiento,
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err) {
      setSaveError(err.response?.data?.mensaje || 'No se pudo registrar el dependiente')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-deep/5 border rounded-xl px-4 py-3 text-deep text-sm placeholder-deep/25 focus:outline-none transition-all ${
      errors[field] ? 'border-red-400/60 focus:border-red-400' : 'border-transparent focus:border-teal'
    }`

  return (
    <PageWrapper>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mis dependientes</h1>
          <p className="text-deep/50 text-sm mt-1">
            Personas a tu cargo que gestionás vos sus turnos
          </p>
        </div>
        {!showForm && (
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

      <div className="w-full max-w-lg space-y-6">
        {/* Formulario */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-4 md:p-6 border border-deep/5 shadow-sm space-y-4"
            >
              <h2 className="text-deep font-bold text-base">Nuevo dependiente</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Nombre" error={errors.nombre}>
                  <input value={form.nombre} onChange={set('nombre')} placeholder="Juan" className={inputClass('nombre')} />
                </FormField>
                <FormField label="Apellido" error={errors.apellido}>
                  <input value={form.apellido} onChange={set('apellido')} placeholder="García" className={inputClass('apellido')} />
                </FormField>
              </div>

              <FormField label="DNI" error={errors.dni}>
                <input value={form.dni} onChange={set('dni')} placeholder="12345678" maxLength={8} className={inputClass('dni')} />
              </FormField>

              <FormField label="Fecha de nacimiento" error={errors.fechaNacimiento}>
                <input type="date" value={form.fechaNacimiento} onChange={set('fechaNacimiento')} className={inputClass('fechaNacimiento')} />
              </FormField>

              {saveError && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {saveError}
                </p>
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

        {/* Lista */}
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
            <p className="text-sm">Todavía no tenés dependientes registrados</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {dependientes.map(dep => (
            <DependienteCard key={dep.id} dep={dep} />
          ))}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
