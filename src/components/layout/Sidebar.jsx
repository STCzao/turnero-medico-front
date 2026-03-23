import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authSlice'
import { ROUTES } from '../../router/routes'
import { ROLES } from '../../constants/roles'

const NAV = {
  [ROLES.PACIENTE]: [
    {
      section: 'INICIO',
      links: [
        { label: 'Inicio', to: ROUTES.HOME, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
      ],
    },
    {
      section: 'TURNOS',
      links: [
        { label: 'Mis Turnos', to: ROUTES.MIS_TURNOS, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
        { label: 'Solicitar Turno', to: ROUTES.SOLICITAR_TURNO, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /> },
      ],
    },
    {
      section: 'MI FAMILIA',
      links: [
        { label: 'Dependientes', to: ROUTES.DEPENDIENTES, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /> },
      ],
    },
  ],
  [ROLES.DOCTOR]: [
    {
      section: 'AGENDA',
      links: [
        { label: 'Mi Agenda', to: ROUTES.MI_AGENDA, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
      ],
    },
  ],
  [ROLES.SECRETARIA]: [
    {
      section: 'GESTIÓN',
      links: [
        { label: 'Pendientes', to: ROUTES.TURNOS_PENDIENTES, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { label: 'Turnos', to: ROUTES.GESTION_TURNOS, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
        { label: 'Médicos', to: ROUTES.GESTION_MEDICOS, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
        { label: 'Pacientes', to: ROUTES.GESTION_PACIENTES, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /> },
      ],
    },
  ],
  [ROLES.ADMIN]: [
    {
      section: 'PANEL',
      links: [
        { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
      ],
    },
    {
      section: 'GESTIÓN',
      links: [
        { label: 'Pendientes', to: ROUTES.TURNOS_PENDIENTES, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
        { label: 'Turnos', to: ROUTES.GESTION_TURNOS, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
        { label: 'Médicos', to: ROUTES.GESTION_MEDICOS, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
        { label: 'Pacientes', to: ROUTES.GESTION_PACIENTES, icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /> },
      ],
    },
  ],
}

function Icon({ d }) {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      {d}
    </svg>
  )
}

export default function Sidebar() {
  const { user } = useAuthStore()
  const rol = user?.rol
  const sections = NAV[rol] ?? []
  const initials = user?.nombre?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'

  return (
    <aside className="hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] w-56 bg-deep pt-6 pb-0 overflow-y-auto z-40">
      {/* Secciones de navegación */}
      <div className="flex-1">
        {sections.map(({ section, links }) => (
          <div key={section} className="mb-6 px-4">
            <p className="text-[10px] font-bold text-mint/30 uppercase tracking-widest mb-2 px-2">{section}</p>
            {links.map(({ label, to, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === ROUTES.MIS_TURNOS}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-mint/70 hover:bg-white/8 hover:text-mint'
                  }`
                }
              >
                <Icon d={icon} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Usuario — perfil */}
      <div className="px-4 pt-3 pb-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-teal/80 flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate leading-tight">{user?.nombre}</p>
            <p className="text-mint/35 text-[10px] truncate leading-tight">{user?.email}</p>
          </div>
        </div>
        <NavLink
          to={ROUTES.PERFIL}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
              isActive ? 'bg-white/15 text-white' : 'text-mint/70 hover:bg-white/8 hover:text-mint'
            }`
          }
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi Perfil
        </NavLink>
      </div>
    </aside>
  )
}
