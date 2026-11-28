import axiosClient from '../config/axiosClient';

// Catálogo público. La API solo devuelve cursos publicados y resuelve
// la paginación (page/limit) del lado del servidor.
export const listarCursos = async ({ q = '', categoria = '', page = 1, limit = 12 } = {}) => {
  const { data } = await axiosClient.get('/cursos', {
    params: { q, categoria, page, limit },
  });

  return data; // { cursos, pagination }
};

export const obtenerCurso = async (cursoId) => {
  const { data } = await axiosClient.get(`/cursos/${cursoId}`);
  return data.curso;
};

export const listarCategorias = async () => {
  const { data } = await axiosClient.get('/cursos/categorias');
  return data.categorias;
};
