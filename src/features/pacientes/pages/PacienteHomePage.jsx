import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../../../components/layout/PageWrapper'
import { useMisTurnos } from '../../turnos/hooks/useTurnos'
import { ROUTES } from '../../../router/routes'
import useAuthStore from '../../../store/authSlice'
import { ESTADO_TURNO } from '../../../constants/estadosTurno'
import { formatFechaHora } from '../../../utils/formatFecha'
import Badge from '../../../components/ui/Badge'

const getSaludo = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

const ACCIONES = [
  {
    label: 'Mis Turnos',
    to: ROUTES.MIS_TURNOS,
    color: 'bg-sky/15 text-sky',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
  {
    label: 'Solicitar Turno',
    to: ROUTES.SOLICITAR_TURNO,
    color: 'bg-teal/15 text-teal',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
  },
  {
    label: 'Dependientes',
    to: ROUTES.DEPENDIENTES,
    color: 'bg-deep/8 text-deep/60',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />,
  },
  {
    label: 'Mi Perfil',
    to: ROUTES.PERFIL,
    color: 'bg-deep/8 text-deep/60',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  },
]

function ProximoTurno({ turnos }) {
  const activos = turnos.filter(t =>
    t.estado === ESTADO_TURNO.CONFIRMADO || t.estado === ESTADO_TURNO.SOLICITUD_PENDIENTE
  )
  if (activos.length === 0) return null
  const turno = activos[0]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <p className="text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-2">Próximo turno</p>
      <Link
        to={ROUTES.MIS_TURNOS}
        className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-deep/5 active:scale-[0.99] transition-transform"
      >
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-deep font-bold text-sm truncate">{turno.especialidadNombre ?? 'Especialidad'}</p>
          <p className="text-deep/45 text-xs mt-0.5">{turno.doctorNombre || 'Médico por asignar'}</p>
          <p className="text-deep/40 text-xs mt-0.5">{formatFechaHora(turno.fechaHora)}</p>
        </div>
        <Badge estado={turno.estado} />
      </Link>
    </motion.div>
  )
}

export default function PacienteHomePage() {
  const nombre = useAuthStore(s => s.user?.nombre)
  const { turnos, loading } = useMisTurnos()

  return (
    <PageWrapper>
      {/* Saludo */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-deep/45 text-sm font-medium">{getSaludo()},</p>
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">{nombre}</h1>
      </motion.div>

      <div className="w-full space-y-8">
        {/* Próximo turno */}
        {loading ? (
          <div className="h-20 bg-deep/5 rounded-2xl animate-pulse" />
        ) : (
          <ProximoTurno turnos={turnos} />
        )}

        {/* Atajos */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-[11px] font-bold text-deep/35 uppercase tracking-widest mb-3">Atajos</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {ACCIONES.map(({ label, to, color, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-deep/5 active:scale-[0.97] transition-transform text-center"
              >
                <span className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${color}`}>
                  <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    {icon}
                  </svg>
                </span>
                <span className="text-deep text-xs md:text-sm font-semibold leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Banner solicitar */}
        {!loading && turnos.filter(t => t.estado === ESTADO_TURNO.SOLICITUD_PENDIENTE || t.estado === ESTADO_TURNO.CONFIRMADO).length === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link
              to={ROUTES.SOLICITAR_TURNO}
              className="flex items-center gap-4 bg-deep rounded-2xl p-5 active:scale-[0.99] transition-transform"
            >
              <div className="flex-1">
                <p className="text-mint font-bold text-base">Pedí tu turno ahora</p>
                <p className="text-mint/60 text-xs mt-0.5">Elegí especialidad y enviá tu solicitud</p>
              </div>
              <svg className="w-5 h-5 text-mint/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  )
}
