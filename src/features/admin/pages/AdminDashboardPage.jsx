import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../../../components/layout/PageWrapper'
import { ROUTES } from '../../../router/routes'
import { turnosService } from '../../turnos/services/turnosService'
import { medicosService } from '../../medicos/services/medicosService'
import { pacientesService } from '../../pacientes/services/pacientesService'
import { ESTADO_TURNO } from '../../../constants/estadosTurno'

function StatCard({ label, value, loading, color = 'teal' }) {
  const colors = {
    teal:   'bg-teal/10 text-teal',
    deep:   'bg-deep/10 text-deep',
    sky:    'bg-sky/20 text-navy',
    amber:  'bg-amber-100 text-amber-700',
  }
  return (
    <div className="bg-white rounded-2xl border border-deep/5 shadow-sm p-5 flex flex-col gap-2">
      <p className="text-xs font-semibold text-deep/40 uppercase tracking-widest">{label}</p>
      {loading ? (
        <div className="h-8 w-16 bg-deep/5 rounded-lg animate-pulse" />
      ) : (
        <p className={`text-3xl font-black ${colors[color]}`}>{value ?? '—'}</p>
      )}
    </div>
  )
}

function NavCard({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-2xl border border-deep/5 shadow-sm p-5 flex items-start gap-4 hover:border-deep/20 hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-deep/5 flex items-center justify-center shrink-0 group-hover:bg-teal/10 transition-colors">
        <svg className="w-5 h-5 text-deep/50 group-hover:text-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-deep">{title}</p>
        <p className="text-xs text-deep/40 mt-0.5">{description}</p>
      </div>
    </Link>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      turnosService.getAll({ page: 1, pageSize: 1, estado: ESTADO_TURNO.SOLICITUD_PENDIENTE }),
      turnosService.getAll({ page: 1, pageSize: 1 }),
      medicosService.getAll({ page: 1, pageSize: 1 }),
      pacientesService.getAll({ page: 1, pageSize: 1 }),
    ])
      .then(([pendientes, turnos, medicos, pacientes]) => {
        setStats({
          turnosPendientes: pendientes.data.total,
          totalTurnos:      turnos.data.total,
          totalMedicos:     medicos.data.total,
          totalPacientes:   pacientes.data.total,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">Dashboard</h1>
        <p className="text-deep/50 text-sm mt-1">Resumen general del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Pendientes" value={stats?.turnosPendientes} loading={loading} color="amber" />
        <StatCard label="Total turnos" value={stats?.totalTurnos} loading={loading} color="sky" />
        <StatCard label="Médicos" value={stats?.totalMedicos} loading={loading} color="teal" />
        <StatCard label="Pacientes" value={stats?.totalPacientes} loading={loading} color="deep" />
      </div>

      {/* Navegación rápida */}
      <h2 className="text-sm font-bold text-deep/40 uppercase tracking-widest mb-4">Gestión</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <NavCard
          to={ROUTES.TURNOS_PENDIENTES}
          title="Solicitudes pendientes"
          description="Confirmar o rechazar turnos"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
        />
        <NavCard
          to={ROUTES.GESTION_TURNOS}
          title="Todos los turnos"
          description="Ver y filtrar todos los turnos"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
        />
        <NavCard
          to={ROUTES.GESTION_MEDICOS}
          title="Médicos"
          description="Listado de médicos del sistema"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
        />
        <NavCard
          to={ROUTES.GESTION_PACIENTES}
          title="Pacientes"
          description="Listado de pacientes registrados"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />}
        />
        <NavCard
          to={ROUTES.ADMIN_USUARIOS}
          title="Secretarias"
          description="Crear cuentas para el personal de secretaría"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.417 2 2.83V19h-4v-2.17A3.001 3.001 0 017 14z" />}
        />
      </div>

      <h2 className="text-sm font-bold text-deep/40 uppercase tracking-widest mb-4">Datos maestros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NavCard
          to={ROUTES.GESTION_ESPECIALIDADES}
          title="Especialidades"
          description="Crear, editar y eliminar especialidades"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />}
        />
        <NavCard
          to={ROUTES.GESTION_OBRAS_SOCIALES}
          title="Obras Sociales"
          description="Crear, editar y eliminar obras sociales"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
        />
        <NavCard
          to={ROUTES.ADMIN_HORARIOS}
          title="Horarios de médicos"
          description="Configurar disponibilidad semanal"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
        />
      </div>
    </PageWrapper>
  )
}
