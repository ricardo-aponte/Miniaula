import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { obtenerCurso } from '../../services/CursoService';
import { inscribirseEnCurso } from '../../services/InscripcionService';
import { getApiError } from '../../utils/apiError';

const CursoDetalle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [enroll, setEnroll] = useState({ loading: false, error: '', done: false });

  const fetchCurso = useCallback(() => obtenerCurso(id), [id]);
  const { data: curso, loading, error } = useFetch(fetchCurso, [id]);

  const handleEnroll = async () => {
    setEnroll({ loading: true, error: '', done: false });

    try {
      await inscribirseEnCurso(id);
      setEnroll({ loading: false, error: '', done: true });
    } catch (enrollError) {
      setEnroll({
        loading: false,
        error: getApiError(enrollError, 'No se pudo completar la inscripción.'),
        done: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/cursos" className="text-sm font-semibold text-indigo-700 hover:underline">
          &larr; Volver al catálogo
        </Link>

        {loading && <p className="mt-6 text-sm text-slate-500">Cargando curso…</p>}

        {error && (
          <div className="mt-6">
            <Alert>{getApiError(error, 'No se pudo cargar el curso.')}</Alert>
          </div>
        )}

        {curso && (
          <>
            <header className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                {curso.categoria} · {curso.nivel}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{curso.titulo}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {curso.instructor?.nombre ?? 'Instructor'} · {curso.totalLecciones} lecciones
              </p>
              <p className="mt-4 whitespace-pre-line text-sm text-slate-700">{curso.descripcion}</p>

              {user?.rol === 'estudiante' && (
                <div className="mt-6">
                  <Alert type="success">
                    {enroll.done && (
                      <>
                        ¡Inscripción confirmada!{' '}
                        <Link to="/mis-cursos" className="font-semibold underline">
                          Ir a mis cursos
                        </Link>
                      </>
                    )}
                  </Alert>
                  <Alert>{enroll.error}</Alert>
                  <Button
                    onClick={handleEnroll}
                    disabled={enroll.loading || enroll.done}
                    className="w-auto px-5"
                  >
                    {enroll.loading ? 'Inscribiendo…' : enroll.done ? 'Inscrito' : 'Inscribirme'}
                  </Button>
                </div>
              )}
            </header>

            <section className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Temario</h2>
              <ol className="mt-3 space-y-2">
                {curso.temario.map((leccion) => (
                  <li
                    key={leccion.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                  >
                    <span className="text-sm text-slate-800">
                      <span className="mr-2 font-semibold text-slate-400">{leccion.orden}.</span>
                      {leccion.titulo}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {leccion.tipo === 'cuestionario'
                        ? `Cuestionario · nota mínima ${leccion.notaMinima}`
                        : 'Contenido'}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default CursoDetalle;
