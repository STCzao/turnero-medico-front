import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { medicosService } from '../services/medicosService'
import useAuthStore from '../../../store/authSlice'
import { ROUTES } from '../../../router/routes'
import { ConfirmModal } from '../../../components/ui/Modal'

function InfoRow({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-deep/5 last:border-0">
      <span className="text-[11px] font-bold text-deep/35 uppercase tracking-widest sm:w-40 shrink-0">{label}</span>
      <span className="text-deep text-sm">{value}</span>
    </div>
  )
}

export default function PerfilMedicoPage() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logoutOpen, setLogoutOpen] = useState(false)

  useEffect(() => {
    medicosService.getMyProfile()
      .then(({ data }) => setPerfil(data))
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mi perfil</h1>
        <p className="text-deep/50 text-sm mt-1">Tu información profesional</p>
      </div>

      {loading && (
        <div className="max-w-lg space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-deep/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {perfil && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-deep/5">
            <h2 className="text-deep font-bold text-base mb-4">Datos profesionales</h2>
            <InfoRow label="Nombre" value={`Dr. ${perfil.nombre} ${perfil.apellido}`} />
            <InfoRow label="Email" value={perfil.email} />
            <InfoRow label="Matrícula" value={perfil.matricula} />
            <InfoRow label="Teléfono" value={perfil.telefono} />
            <InfoRow label="Especialidad" value={perfil.especialidadNombre} />
            <p className="text-xs text-deep/35 mt-4">Para modificar tus datos, contactá con el administrador del sistema.</p>
          </div>

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
        onConfirm={() => { logout(); navigate(ROUTES.LOGIN) }}
        title="Cerrar sesión"
        message="¿Querés cerrar tu sesión? Deberás iniciar sesión nuevamente para acceder."
        confirmLabel="Cerrar sesión"
        variant="danger"
      />
    </PageWrapper>
  )
}
