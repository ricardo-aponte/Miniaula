import { Link, useNavigate, useSearchParams } from 'react-router';
import useAuth from '../hooks/useAuth';
import ProfileMenu from './ProfileMenu';

// Navbar del área autenticada: título, buscador por título, "Mis cursos" y avatar.
const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    navigate(value ? `/cursos?q=${encodeURIComponent(value)}` : '/cursos');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-indigo-700">
          MiniAula
        </Link>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="order-3 flex w-full items-center gap-2 sm:order-2 sm:w-auto sm:flex-1"
        >
          {/* `key` reinicia el campo cuando cambia ?q= del catálogo. */}
          <input
            key={q}
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar curso por título"
            aria-label="Buscar curso por título"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Buscar
          </button>
        </form>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:ml-0">
          {user?.rol !== 'instructor' && (
            <Link
              to="/mis-cursos"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
            >
              Mis cursos
            </Link>
          )}
          <ProfileMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
