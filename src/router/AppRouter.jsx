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
import PerfilPacientePage from '../features/pacientes/pages/PerfilPacientePage'
import DependientesPage from '../features/pacientes/pages/DependientesPage'
import PerfilPage from '../pages/PerfilPage'
import { TODOS_LOS_ROLES } from '../constants/roles'
import PacienteHomePage from '../features/pacientes/pages/PacienteHomePage'
import HistorialPage from '../features/turnos/pages/HistorialPage'
import GestionPendientesPage from '../features/turnos/pages/GestionPendientesPage'
import GestionTurnosPage from '../features/turnos/pages/GestionTurnosPage'
import GestionPacientesPage from '../features/pacientes/pages/GestionPacientesPage'
import GestionMedicosPage from '../features/medicos/pages/GestionMedicosPage'
import GestionEspecialidadesPage from '../features/especialidades/pages/GestionEspecialidadesPage'
import GestionObrasSocialesPage from '../features/obrasSociales/pages/GestionObrasSocialesPage'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'
import AdminHorariosPage from '../features/admin/pages/AdminHorariosPage'
import GestionSecretariasPage from '../features/admin/pages/GestionSecretariasPage'


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

        {/* Perfil — todos los roles autenticados */}
        <Route element={<PrivateRoute roles={TODOS_LOS_ROLES} />}>
          <Route path={ROUTES.PERFIL} element={<PerfilPage />} />
        </Route>

        {/* Paciente */}
        <Route element={<PrivateRoute roles={[ROLES.PACIENTE]} />}>
          <Route path={ROUTES.HOME} element={<PacienteHomePage />} />
          <Route path={ROUTES.MIS_TURNOS} element={<MisTurnosPage />} />
          <Route path={ROUTES.SOLICITAR_TURNO} element={<SolicitarTurnoPage />} />
          <Route path={ROUTES.DEPENDIENTES} element={<DependientesPage />} />
          <Route path={ROUTES.HISTORIAL} element={<HistorialPage />} />
        </Route>

        {/* Doctor */}
        <Route element={<PrivateRoute roles={[ROLES.DOCTOR]} />}>
          <Route path={ROUTES.MI_AGENDA} element={<MiAgendaPage />} />
        </Route>

        {/* Secretaria + Admin — gestión */}
        <Route element={<PrivateRoute roles={[ROLES.SECRETARIA, ROLES.ADMIN]} />}>
          <Route path={ROUTES.TURNOS_PENDIENTES} element={<GestionPendientesPage />} />
          <Route path={ROUTES.GESTION_TURNOS} element={<GestionTurnosPage />} />
          <Route path={ROUTES.GESTION_MEDICOS} element={<GestionMedicosPage />} />
          <Route path={ROUTES.GESTION_PACIENTES} element={<GestionPacientesPage />} />
          <Route path={ROUTES.GESTION_OBRAS_SOCIALES} element={<GestionObrasSocialesPage />} />
          <Route path={ROUTES.GESTION_ESPECIALIDADES} element={<GestionEspecialidadesPage />} />
        </Route>

        {/* Solo Admin */}
        <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_HORARIOS} element={<AdminHorariosPage />} />
          <Route path={ROUTES.ADMIN_USUARIOS} element={<GestionSecretariasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
