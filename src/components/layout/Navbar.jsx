import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authSlice'
import { ROUTES } from '../../router/routes'
import { ROLES } from '../../constants/roles'
import Button from '../ui/Button'
import logo from '../../assets/logo.png'

const NAV_LINKS = {
  [ROLES.PACIENTE]: [
    { label: 'Mis Turnos', to: ROUTES.MIS_TURNOS },
    { label: 'Solicitar Turno', to: ROUTES.SOLICITAR_TURNO },
    { label: 'Perfil', to: ROUTES.PERFIL },
  ],
  [ROLES.DOCTOR]: [
    { label: 'Mi Agenda', to: ROUTES.MI_AGENDA },
  ],
  [ROLES.SECRETARIA]: [
    { label: 'Pendientes', to: ROUTES.TURNOS_PENDIENTES },
    { label: 'Turnos', to: ROUTES.GESTION_TURNOS },
    { label: 'Médicos', to: ROUTES.GESTION_MEDICOS },
    { label: 'Pacientes', to: ROUTES.GESTION_PACIENTES },
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD },
    { label: 'Pendientes', to: ROUTES.TURNOS_PENDIENTES },
    { label: 'Turnos', to: ROUTES.GESTION_TURNOS },
    { label: 'Médicos', to: ROUTES.GESTION_MEDICOS },
    { label: 'Pacientes', to: ROUTES.GESTION_PACIENTES },
  ],
}

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const links = NAV_LINKS[user?.rol] ?? []

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <header className="bg-deep text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <img src={logo} alt="Clínica Meridian" className="h-12 w-auto" />

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === to
                  ? 'bg-white/15 text-white'
                  : 'text-mint hover:bg-white/10',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Usuario + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block text-sm text-sky">
            {user?.nombre} · <span className="text-mint/70">{user?.rol}</span>
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}
