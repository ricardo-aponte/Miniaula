import axiosClient from '../config/axiosClient';

export const inscribirseEnCurso = async (cursoId) => {
  const { data } = await axiosClient.post(`/cursos/${cursoId}/inscripcion`);
  return data;
};

export const listarMisCursos = async () => {
  const { data } = await axiosClient.get('/inscripciones/mias');
  return data.inscripciones;
};
