import { Link, useNavigate } from 'react-router';
import Button from './Button';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-700">
          MiniAula
        </Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {isLoggedIn && (
            <>
              <Link to="/" className="text-slate-600 hover:text-indigo-700">
                Inicio
              </Link>
              <Link to="/perfil" className="text-slate-600 hover:text-indigo-700">
                Perfil
              </Link>
              <span className="text-slate-500">{user?.nombre}</span>
              <Button variant="secondary" className="w-auto px-3 py-1" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
