import { useCallback } from 'react';
import { Link } from 'react-router';
import Alert from '../../components/Alert';
import Navbar from '../../components/Navbar';
import useFetch from '../../hooks/useFetch';
import { listarMisCursos } from '../../services/InscripcionService';
import { getApiError } from '../../utils/apiError';

const MisCursos = () => {
  const fetchMisCursos = useCallback(() => listarMisCursos(), []);
  const { data: inscripciones, loading, error, isEmpty } = useFetch(fetchMisCursos, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Mis cursos</h1>
        <p className="mt-1 text-sm text-slate-600">Tu avance en cada curso en el que estás inscrito.</p>

        {loading && <p className="mt-6 text-sm text-slate-500">Cargando tus cursos…</p>}

        {error && (
          <div className="mt-6">
            <Alert>{getApiError(error, 'No se pudieron cargar tus cursos.')}</Alert>
          </div>
        )}

        {isEmpty && (
          <div className="mt-6">
            <Alert type="info">Todavía no estás inscrito en ningún curso.</Alert>
            <Link
              to="/cursos"
              className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Explorar catálogo
            </Link>
          </div>
        )}

        {!loading && !error && (
          <ul className="mt-6 space-y-4">
            {(inscripciones ?? []).map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{item.curso?.titulo}</h2>
                    <p className="text-sm text-slate-600">
                      {item.leccionesCompletadas} de {item.totalLecciones} lecciones completadas
                    </p>
                  </div>
                  <Link
                    to={`/cursos/${item.curso?.id}`}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    {item.porcentajeAvance > 0 ? 'Continuar' : 'Empezar'}
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${item.porcentajeAvance}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {item.porcentajeAvance}% de avance
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MisCursos;
