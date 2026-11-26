import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

// Rutas protegidas por sesión y, si se indica `roles`, por rol.
const AuthenticatedRoute = ({ children, roles }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles?.length && !roles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthenticatedRoute;
