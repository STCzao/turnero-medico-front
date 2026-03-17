import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import PrivateRoute from './PrivateRoute'
import { ROLES } from '../constants/roles'

// Lazy imports para code-splitting automático
import { lazy, Suspense } from 'react'

const LoginPage        = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage     = lazy(() => import('../features/auth/pages/RegisterPage'))

const MisTurnosPage    = lazy(() => import('../features/turnos/pages/MisTurnosPage'))
const SolicitarTurnoPage = lazy(() => import('../features/turnos/pages/SolicitarTurnoPage'))

const MiAgendaPage     = lazy(() => import('../features/turnos/pages/MiAgendaPage'))

const PerfilPacientePage = lazy(() => import('../features/pacientes/pages/PerfilPacientePage'))
const HistorialPage    = lazy(() => import('../features/pacientes/pages/HistorialPage'))

const PendientesPage   = lazy(() => import('../features/admin/pages/PendientesPage'))
const GestionTurnosPage = lazy(() => import('../features/admin/pages/GestionTurnosPage'))
const GestionMedicosPage = lazy(() => import('../features/admin/pages/GestionMedicosPage'))
const GestionPacientesPage = lazy(() => import('../features/admin/pages/GestionPacientesPage'))
const DashboardPage    = lazy(() => import('../features/admin/pages/DashboardPage'))

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
        <Routes>
          {/* Públicas */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

          {/* Paciente */}
          <Route element={<PrivateRoute roles={[ROLES.PACIENTE]} />}>
            <Route path={ROUTES.MIS_TURNOS} element={<MisTurnosPage />} />
            <Route path={ROUTES.SOLICITAR_TURNO} element={<SolicitarTurnoPage />} />
            <Route path={ROUTES.PERFIL} element={<PerfilPacientePage />} />
            <Route path={ROUTES.HISTORIAL} element={<HistorialPage />} />
          </Route>

          {/* Doctor */}
          <Route element={<PrivateRoute roles={[ROLES.DOCTOR]} />}>
            <Route path={ROUTES.MI_AGENDA} element={<MiAgendaPage />} />
          </Route>

          {/* Secretaria + Admin — gestión */}
          <Route element={<PrivateRoute roles={[ROLES.SECRETARIA, ROLES.ADMIN]} />}>
            <Route path={ROUTES.TURNOS_PENDIENTES} element={<PendientesPage />} />
            <Route path={ROUTES.GESTION_TURNOS} element={<GestionTurnosPage />} />
            <Route path={ROUTES.GESTION_MEDICOS} element={<GestionMedicosPage />} />
            <Route path={ROUTES.GESTION_PACIENTES} element={<GestionPacientesPage />} />
          </Route>

          {/* Solo Admin */}
          <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<DashboardPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
