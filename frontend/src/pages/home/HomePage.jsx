import { Link } from 'react-router';
import SiteNavbar from '../../components/SiteNavbar';
import { HOME_MENU_ITEMS } from '../../config/navigation';

const HomePage = () => (
  <div className="min-h-screen bg-slate-50">
    <SiteNavbar items={HOME_MENU_ITEMS} />
    <main className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">MiniAula</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        Aprende a tu ritmo, en cualquier momento
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
        Cursos cortos, lecciones claras y cuestionarios para avanzar paso a paso.
      </p>
      <Link
        to="/login"
        className="mt-8 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Entrar a la Plataforma Virtual
      </Link>
    </main>
  </div>
);

export default HomePage;
