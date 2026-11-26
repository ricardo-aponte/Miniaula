import { Navigate, Route, Routes } from 'react-router';
import AuthenticatedRoute from './AuthenticatedRoute';
import HomeRoute from './HomeRoute';
import FormLogin from '../pages/auth/FormLogin';
import FormRegistro from '../pages/auth/FormRegistro';
import Perfil from '../pages/dashboard/Perfil';

const RouterConfig = () => (
  <Routes>
    <Route path="/login" element={<FormLogin />} />

    <Route path="/register" element={<FormRegistro />} />

    <Route path="/" element={<HomeRoute />} />

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
