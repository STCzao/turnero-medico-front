import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authSlice'
import { ROUTES } from '../../router/routes'
import { ROLES } from '../../constants/roles'

const TABS = {
  [ROLES.PACIENTE]: [
    {
      label: 'Inicio',
      to: ROUTES.HOME,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      label: 'Turnos',
      to: ROUTES.MIS_TURNOS,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      label: 'Solicitar',
      to: ROUTES.SOLICITAR_TURNO,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
      highlight: true,
    },
    {
      label: 'Familia',
      to: ROUTES.DEPENDIENTES,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />,
    },
    {
      label: 'Perfil',
      to: ROUTES.PERFIL,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    },
  ],
  [ROLES.DOCTOR]: [
    {
      label: 'Agenda',
      to: ROUTES.MI_AGENDA,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    },
    {
      label: 'Perfil',
      to: ROUTES.PERFIL,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    },
  ],
  [ROLES.SECRETARIA]: [
    {
      label: 'Pendientes',
      to: ROUTES.TURNOS_PENDIENTES,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      label: 'Turnos',
      to: ROUTES.GESTION_TURNOS,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      label: 'Médicos',
      to: ROUTES.GESTION_MEDICOS,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    },
    {
      label: 'Pacientes',
      to: ROUTES.GESTION_PACIENTES,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />,
    },
  ],
  [ROLES.ADMIN]: [
    {
      label: 'Dashboard',
      to: ROUTES.ADMIN_DASHBOARD,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      label: 'Pendientes',
      to: ROUTES.TURNOS_PENDIENTES,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      label: 'Turnos',
      to: ROUTES.GESTION_TURNOS,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      label: 'Pacientes',
      to: ROUTES.GESTION_PACIENTES,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />,
    },
  ],
}

export default function BottomNav() {
  const rol = useAuthStore(s => s.user?.rol)
  const tabs = TABS[rol] ?? []

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-deep border-t border-white/8 flex items-stretch safe-area-bottom">
      {tabs.map(({ label, to, icon, highlight }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.MIS_TURNOS}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold tracking-wide transition-colors ${
              highlight
                ? isActive
                  ? 'text-mint'
                  : 'text-sky'
                : isActive
                  ? 'text-white'
                  : 'text-mint/40'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {highlight ? (
                <span className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg -translate-y-4 ring-4 ring-deep transition-all ${isActive ? 'bg-teal scale-105' : 'bg-sky'}`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    {icon}
                  </svg>
                </span>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.25 : 1.75}>
                  {icon}
                </svg>
              )}
              {!highlight && <span>{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
