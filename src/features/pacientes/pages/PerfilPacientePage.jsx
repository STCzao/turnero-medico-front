import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { useMyProfile } from '../hooks/usePacientes'
import { ROUTES } from '../../../router/routes'
import useAuthStore from '../../../store/authSlice'
import { validate, rules } from '../../../utils/validators'
import { ConfirmModal } from '../../../components/ui/Modal'

const SCHEMA_EDIT = {
  nombre:   [rules.required('Ingresá el nombre')],
  apellido: [rules.required('Ingresá el apellido')],
  email:    [rules.required('Ingresá el email')],
}

function InfoRow({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-deep/5 last:border-0">
      <span className="text-[11px] font-bold text-deep/35 uppercase tracking-widest sm:w-40 shrink-0">{label}</span>
      <span className="text-deep text-sm">{value}</span>
    </div>
  )
}

export default function PerfilPacientePage() {
  const { perfil, loading, error, update } = useMyProfile()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [editErrors, setEditErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [logoutOpen, setLogoutOpen] = useState(false)
  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN) }

  const startEdit = () => {
    setEditForm({
      nombre:          perfil.nombre ?? '',
      apellido:        perfil.apellido ?? '',
      email:           perfil.email ?? '',
      telefono:        perfil.telefono ?? '',
      fechaNacimiento: perfil.fechaNacimiento ? perfil.fechaNacimiento.split('T')[0] : '',
    })
    setEditErrors({})
    setSaveError(null)
    setEditing(true)
  }

  const set = (field) => (e) => {
    setEditForm(f => ({ ...f, [field]: e.target.value }))
    setEditErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSave = async () => {
    const errs = validate(SCHEMA_EDIT, editForm)
    if (Object.keys(errs).length) { setEditErrors(errs); return }
    setSaving(true)
    setSaveError(null)
    try {
      await update({
        nombre:          editForm.nombre.trim(),
        apellido:        editForm.apellido.trim(),
        email:           editForm.email.trim(),
        telefono:        editForm.telefono.trim() || null,
        fechaNacimiento: editForm.fechaNacimiento || null,
      })
      setEditing(false)
    } catch (err) {
      setSaveError(err.response?.data?.mensaje || 'No se pudo actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = (field) =>
    `w-full bg-deep/5 border rounded-xl px-4 py-2.5 text-deep text-sm placeholder-deep/25 focus:outline-none transition-all ${
      editErrors[field] ? 'border-red-400/60 focus:border-red-400' : 'border-transparent focus:border-teal'
    }`

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mi perfil</h1>
        <p className="text-deep/50 text-sm mt-1">Tus datos personales</p>
      </div>

      {loading && (
        <div className="max-w-lg space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-deep/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {perfil && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto space-y-6">
          {/* Datos personales */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-deep/5">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-deep font-bold text-base">Datos personales</h2>
            {!editing && (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 bg-teal/10 text-teal hover:bg-teal hover:text-white font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar
              </button>
            )}
          </div>
            {/* DNI siempre read-only */}
            <InfoRow label="DNI" value={perfil.dni} />

            {!editing ? (
              <>
                <InfoRow label="Nombre" value={`${perfil.nombre} ${perfil.apellido}`} />
                <InfoRow label="Email" value={perfil.email} />
                <InfoRow label="Teléfono" value={perfil.telefono} />
                <InfoRow
                  label="Fecha de nacimiento"
                  value={perfil.fechaNacimiento ? new Date(perfil.fechaNacimiento).toLocaleDateString('es-AR') : null}
                />
              </>
            ) : (
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-1.5">Nombre <span className="text-red-400">*</span></label>
                    <input value={editForm.nombre} onChange={set('nombre')} className={inputCls('nombre')} placeholder="Nombre" />
                    {editErrors.nombre && <p className="text-red-500 text-xs mt-1">{editErrors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-1.5">Apellido <span className="text-red-400">*</span></label>
                    <input value={editForm.apellido} onChange={set('apellido')} className={inputCls('apellido')} placeholder="Apellido" />
                    {editErrors.apellido && <p className="text-red-500 text-xs mt-1">{editErrors.apellido}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input type="email" value={editForm.email} onChange={set('email')} className={inputCls('email')} placeholder="Email" />
                  {editErrors.email && <p className="text-red-500 text-xs mt-1">{editErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-1.5">Teléfono</label>
                  <input value={editForm.telefono} onChange={set('telefono')} className={inputCls('telefono')} placeholder="Ej: 011 1234-5678" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-1.5">Fecha de nacimiento</label>
                  <input type="date" value={editForm.fechaNacimiento} onChange={set('fechaNacimiento')} className={inputCls('fechaNacimiento')} />
                </div>
                {saveError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{saveError}</p>}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl border border-deep/10 text-deep/50 text-sm font-semibold hover:bg-deep/5 transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-deep text-mint text-sm font-bold hover:bg-navy transition-colors disabled:opacity-40">
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dependientes */}
          <Link
            to={ROUTES.DEPENDIENTES}
            className="flex items-center justify-between bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-deep/5 hover:border-teal/30 transition-colors group active:scale-[0.99]"
          >
            <div>
              <p className="text-deep font-bold text-sm">Mis dependientes</p>
              <p className="text-deep/40 text-xs mt-0.5">Gestioná los menores a tu cargo</p>
            </div>
            <svg className="w-5 h-5 text-deep/30 group-hover:text-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Cerrar sesión */}
          <button
            onClick={() => setLogoutOpen(true)}
            className="w-full flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-deep/5 hover:border-red-200 transition-colors group active:scale-[0.99] text-left"
          >
            <div>
              <p className="text-red-500 font-bold text-sm">Cerrar sesión</p>
              <p className="text-deep/35 text-xs mt-0.5">Salir de tu cuenta</p>
            </div>
            <svg className="w-5 h-5 text-red-300 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </motion.div>
      )}

      <ConfirmModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        message="¿Querés cerrar tu sesión? Deberás iniciar sesión nuevamente para acceder."
        confirmLabel="Cerrar sesión"
        variant="danger"
      />
    </PageWrapper>
  )
}
