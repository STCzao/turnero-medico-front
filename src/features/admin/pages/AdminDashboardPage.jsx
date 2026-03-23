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
        <span className="text-lg">{icon}</span>
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
          turnosPendientes: pendientes.data.totalCount,
          totalTurnos:      turnos.data.totalCount,
          totalMedicos:     medicos.data.totalCount,
          totalPacientes:   pacientes.data.totalCount,
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
          icon="📋"
        />
        <NavCard
          to={ROUTES.GESTION_TURNOS}
          title="Todos los turnos"
          description="Ver y filtrar todos los turnos"
          icon="🗓️"
        />
        <NavCard
          to={ROUTES.GESTION_MEDICOS}
          title="Médicos"
          description="Listado de médicos del sistema"
          icon="👨‍⚕️"
        />
        <NavCard
          to={ROUTES.GESTION_PACIENTES}
          title="Pacientes"
          description="Listado de pacientes registrados"
          icon="🧑‍🤝‍🧑"
        />
      </div>

      <h2 className="text-sm font-bold text-deep/40 uppercase tracking-widest mb-4">Datos maestros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NavCard
          to={ROUTES.GESTION_ESPECIALIDADES}
          title="Especialidades"
          description="Crear, editar y eliminar especialidades"
          icon="🩺"
        />
        <NavCard
          to={ROUTES.GESTION_OBRAS_SOCIALES}
          title="Obras Sociales"
          description="Crear, editar y eliminar obras sociales"
          icon="🏥"
        />
        <NavCard
          to={ROUTES.ADMIN_HORARIOS}
          title="Horarios de médicos"
          description="Configurar disponibilidad semanal"
          icon="🕐"
        />
      </div>
    </PageWrapper>
  )
}
