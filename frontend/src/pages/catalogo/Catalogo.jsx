import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import Alert from '../../components/Alert';
import CourseCard from '../../components/CourseCard';
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import useCatalogo from '../../hooks/useCatalogo';
import useFetch from '../../hooks/useFetch';
import { listarCategorias } from '../../services/CursoService';
import { getApiError } from '../../utils/apiError';

const chipStyles = (active) =>
  `shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
    active
      ? 'border-indigo-600 bg-indigo-600 text-white'
      : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700'
  }`;

const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { q, categoria, cursos, pagination, loading, error, isEmpty } = useCatalogo();

  const fetchCategorias = useCallback(() => listarCategorias(), []);
  const { data: categorias } = useFetch(fetchCategorias, []);
  const opciones = useMemo(() => ['', ...(categorias ?? [])], [categorias]);

  // Cambiar un filtro siempre vuelve a la página 1, salvo que el cambio sea de página.
  const updateFilters = (changes) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (!('page' in changes)) {
      params.delete('page');
    }

    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Cursos disponibles</h1>
          <p className="mt-1 text-sm text-slate-600">
            {q ? `Resultados para “${q}”` : 'Explora el catálogo y empieza cuando quieras.'}
          </p>
        </header>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categorías">
          {opciones.map((opcion) => (
            <button
              key={opcion || 'todas'}
              type="button"
              role="tab"
              aria-selected={opcion === categoria}
              onClick={() => updateFilters({ categoria: opcion })}
              className={chipStyles(opcion === categoria)}
            >
              {opcion || 'Todas'}
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-sm text-slate-500">Cargando cursos…</p>}

        {error && (
          <div className="mt-8">
            <Alert>{getApiError(error, 'No se pudo cargar el catálogo.')}</Alert>
          </div>
        )}

        {isEmpty && (
          <div className="mt-8">
            <Alert type="info">No encontramos cursos con esos filtros.</Alert>
          </div>
        )}

        {!loading && !error && cursos.length > 0 && (
          <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => (
              <CourseCard key={curso.id} curso={curso} />
            ))}
          </section>
        )}

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasPrevPage={pagination.hasPrevPage}
            hasNextPage={pagination.hasNextPage}
            onChange={(nextPage) => updateFilters({ page: String(nextPage) })}
          />
        )}
      </main>
    </div>
  );
};

export default Catalogo;
