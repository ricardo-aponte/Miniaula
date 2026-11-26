import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';

const ROLE_LINKS = {
  estudiante: [
    { to: '/cursos', label: 'Explorar catálogo' },
    { to: '/mis-cursos', label: 'Mis cursos' },
  ],
  instructor: [
    { to: '/instructor/cursos', label: 'Mis cursos' },
    { to: '/instructor/panel', label: 'Panel de avance' },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const links = ROLE_LINKS[user?.rol] ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Hola, {user?.nombre ?? 'estudiante'}
        </h1>
        <p className="mt-2 text-slate-600">
          Tu rol en MiniAula es <strong>{user?.rol}</strong>.
        </p>
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <div
              key={link.to}
              className="rounded-xl border border-slate-200 bg-white p-5 text-indigo-700 shadow-sm"
            >
              {link.label}
            </div>
          ))}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-indigo-700 shadow-sm">
            <a href="/perfil" className="hover:underline">
              Ver mi perfil
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
