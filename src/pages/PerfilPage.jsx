import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import useAuthStore from '../store/authSlice'
import { ROLES } from '../constants/roles'
import { ROUTES } from '../router/routes'
import { ConfirmModal } from '../components/ui/Modal'
import PerfilPacientePage from '../features/pacientes/pages/PerfilPacientePage'
import PerfilMedicoPage from '../features/medicos/pages/PerfilMedicoPage'

function InfoRow({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-deep/5 last:border-0">
      <span className="text-[11px] font-bold text-deep/35 uppercase tracking-widest sm:w-40 shrink-0">{label}</span>
      <span className="text-deep text-sm">{value}</span>
    </div>
  )
}

// Perfil para Admin y Secretaria — solo lectura desde JWT
function PerfilStaff() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const rolLabel = { Admin: 'Administrador', Secretaria: 'Secretaria' }[user?.rol] ?? user?.rol

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Mi perfil</h1>
        <p className="text-deep/50 text-sm mt-1">Tu información de cuenta</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-deep/5">
          <h2 className="text-deep font-bold text-base mb-4">Datos de la cuenta</h2>
          <InfoRow label="Nombre" value={user?.nombre} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Rol" value={rolLabel} />
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

export default function PerfilPage() {
  const { user } = useAuthStore()
  const rol = user?.rol

  if (rol === ROLES.PACIENTE) return <PerfilPacientePage />
  if (rol === ROLES.DOCTOR)   return <PerfilMedicoPage />
  return <PerfilStaff />
}
