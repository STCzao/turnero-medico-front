import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import { ROLES } from '../constants/roles'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import MisTurnosPage from '../features/turnos/pages/MisTurnosPage'
import SolicitarTurnoPage from '../features/turnos/pages/SolicitarTurnoPage'
import MiAgendaPage from '../features/turnos/pages/MiAgendaPage'
import PageWrapper from '../components/layout/PageWrapper'

// TODO: reemplazar placeholders por páginas reales al avanzar en cada fase
const Placeholder = ({ titulo }) => (
  <PageWrapper>
    <div className="flex items-center justify-center h-64 text-navy/40 text-xl">
      {titulo} — próximamente
    </div>
  </PageWrapper>
)

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas — redirigen al home si ya está autenticado */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* Paciente */}
        <Route element={<PrivateRoute roles={[ROLES.PACIENTE]} />}>
          <Route path={ROUTES.MIS_TURNOS} element={<MisTurnosPage />} />
          <Route path={ROUTES.SOLICITAR_TURNO} element={<SolicitarTurnoPage />} />
          <Route path={ROUTES.PERFIL} element={<Placeholder titulo="Perfil" />} />
          <Route path={ROUTES.HISTORIAL} element={<Placeholder titulo="Historial" />} />
        </Route>

        {/* Doctor */}
        <Route element={<PrivateRoute roles={[ROLES.DOCTOR]} />}>
          <Route path={ROUTES.MI_AGENDA} element={<MiAgendaPage />} />
        </Route>

        {/* Secretaria + Admin — gestión */}
        <Route element={<PrivateRoute roles={[ROLES.SECRETARIA, ROLES.ADMIN]} />}>
          <Route path={ROUTES.TURNOS_PENDIENTES} element={<Placeholder titulo="Turnos Pendientes" />} />
          <Route path={ROUTES.GESTION_TURNOS} element={<Placeholder titulo="Gestión de Turnos" />} />
          <Route path={ROUTES.GESTION_MEDICOS} element={<Placeholder titulo="Gestión de Médicos" />} />
          <Route path={ROUTES.GESTION_PACIENTES} element={<Placeholder titulo="Gestión de Pacientes" />} />
        </Route>

        {/* Solo Admin */}
        <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<Placeholder titulo="Dashboard Admin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
