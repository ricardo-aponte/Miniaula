import useAuth from '../hooks/useAuth';
import Catalogo from '../pages/catalogo/Catalogo';
import Dashboard from '../pages/dashboard/Dashboard';
import HomePage from '../pages/home/HomePage';

// Sin sesión, la portada pública. Con sesión: el estudiante entra al catálogo
// y el instructor a su panel.
const HomeRoute = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <HomePage />;
  }

  return user?.rol === 'instructor' ? <Dashboard /> : <Catalogo />;
};

export default HomeRoute;
