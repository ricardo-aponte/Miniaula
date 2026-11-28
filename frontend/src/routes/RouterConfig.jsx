import { Navigate, Route, Routes } from 'react-router';
import AuthenticatedRoute from './AuthenticatedRoute';
import HomeRoute from './HomeRoute';
import FormLogin from '../pages/auth/FormLogin';
import FormRegistro from '../pages/auth/FormRegistro';
import Catalogo from '../pages/catalogo/Catalogo';
import CursoDetalle from '../pages/catalogo/CursoDetalle';
import MisCursos from '../pages/catalogo/MisCursos';
import Perfil from '../pages/dashboard/Perfil';

const RouterConfig = () => (
  <Routes>
    <Route path="/login" element={<FormLogin />} />

    <Route path="/register" element={<FormRegistro />} />

    <Route path="/" element={<HomeRoute />} />

    <Route
      path="/cursos"
      element={
        <AuthenticatedRoute>
          <Catalogo />
        </AuthenticatedRoute>
      }
    />

    <Route
      path="/cursos/:id"
      element={
        <AuthenticatedRoute>
          <CursoDetalle />
        </AuthenticatedRoute>
      }
    />

    <Route
      path="/mis-cursos"
      element={
        <AuthenticatedRoute roles={['estudiante']}>
          <MisCursos />
        </AuthenticatedRoute>
      }
    />

    <Route
      path="/perfil"
      element={
        <AuthenticatedRoute>
          <Perfil />
        </AuthenticatedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RouterConfig;
