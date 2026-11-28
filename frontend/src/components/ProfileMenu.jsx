import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import { getInitials } from '../utils/initials';

// Avatar circular con las iniciales del usuario y menú de sesión.
const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Menú de ${user?.nombre ?? 'usuario'}`}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700"
      >
        {getInitials(user?.nombre)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.nombre}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <Link
            to="/perfil"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Mi perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
