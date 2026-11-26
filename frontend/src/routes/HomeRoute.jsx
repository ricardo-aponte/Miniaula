import useAuth from '../hooks/useAuth';
import Dashboard from '../Dashboard';
import HomePage from '../pages/HomePage';

// El inicio público muestra la HomePage; con sesión se conserva el panel existente.
const HomeRoute = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Dashboard /> : <HomePage />;
};

export default HomeRoute;
