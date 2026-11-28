import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import useFetch from './useFetch';
import { listarCursos } from '../services/CursoService';

export const CATALOGO_LIMIT = 12;

const toPage = (value) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

// Lee los filtros de la URL (?q=&categoria=&page=) y pide esa página a la API.
export function useCatalogo() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const categoria = searchParams.get('categoria') ?? '';
  const page = toPage(searchParams.get('page'));

  const fetcher = useCallback(
    () => listarCursos({ q, categoria, page, limit: CATALOGO_LIMIT }),
    [q, categoria, page]
  );

  const { data, loading, error, refetch } = useFetch(fetcher, [q, categoria, page]);
  const cursos = data?.cursos ?? [];

  return {
    q,
    categoria,
    page,
    cursos,
    pagination: data?.pagination ?? null,
    loading,
    error,
    isEmpty: !loading && !error && cursos.length === 0,
    refetch,
  };
}

export default useCatalogo;
