import { leccionRepository } from '../repositories/leccion.repository.js';
import { AppError } from '../errors/AppError.js';
import { toPlain } from '../utils/serializers.js';

function normalizarCreacion(data) {
  const base = {
    titulo: data.titulo,
    tipo: data.tipo,
    contenido: null,
    videoUrl: null,
    notaMinima: null,
  };

  if (data.tipo === 'contenido') {
    base.contenido = data.contenido ?? null;
    base.videoUrl = data.videoUrl ?? null;
  } else {
    base.notaMinima = data.notaMinima;
  }

  return base;
}

export const leccionService = {
  async create(curso, data) {
    if (curso.estado === 'archivado') {
      throw new AppError(
        'No se pueden agregar lecciones a un curso archivado.',
        422,
        'COURSE_ARCHIVED'
      );
    }

    const ultimoOrden = (await leccionRepository.maxOrden(curso.id)) ?? 0;

    const leccion = await leccionRepository.create({
      ...normalizarCreacion(data),
      orden: ultimoOrden + 1,
      cursoId: curso.id,
    });

    return toPlain(leccion);
  },

  async update(leccion, data) {
    const cambios = { ...data };

    if (leccion.tipo === 'contenido') {
      if (cambios.notaMinima !== undefined) {
        throw new AppError(
          'La nota mínima solo aplica a lecciones de tipo cuestionario.',
          422,
          'INVALID_LESSON_UPDATE'
        );
      }

      const contenido = cambios.contenido !== undefined ? cambios.contenido : leccion.contenido;
      const videoUrl = cambios.videoUrl !== undefined ? cambios.videoUrl : leccion.videoUrl;

      if (!contenido && !videoUrl) {
        throw new AppError(
          'La lección de contenido debe conservar texto o un enlace de video.',
          422,
          'LESSON_CONTENT_REQUIRED'
        );
      }
    } else {
      if (cambios.contenido !== undefined || cambios.videoUrl !== undefined) {
        throw new AppError(
          'Un cuestionario no admite contenido ni enlace de video.',
          422,
          'INVALID_LESSON_UPDATE'
        );
      }
    }

    const actualizada = await leccionRepository.updateById(leccion.id, cambios);
    return toPlain(actualizada);
  },

  async remove(leccion, curso) {
    if (curso.estado === 'publicado') {
      const total = await leccionRepository.countByCurso(curso.id);

      if (total <= 1) {
        throw new AppError(
          'No se puede eliminar la última lección de un curso publicado.',
          422,
          'COURSE_WOULD_HAVE_NO_LESSONS'
        );
      }
    }

    await leccionRepository.deleteById(leccion.id);
  },

  async reorder(curso, ordenIds) {
    const lecciones = await leccionRepository.findByCurso(curso.id);
    const idsDelCurso = lecciones.map((leccion) => Number(leccion.id));

    if (ordenIds.length !== idsDelCurso.length) {
      throw new AppError(
        'El nuevo orden debe incluir todas las lecciones del curso exactamente una vez.',
        422,
        'INVALID_LESSON_ORDER',
        { esperadas: idsDelCurso, recibidas: ordenIds }
      );
    }

    const idsUnicos = new Set(ordenIds);

    if (idsUnicos.size !== ordenIds.length) {
      throw new AppError(
        'El nuevo orden contiene lecciones repetidas.',
        422,
        'INVALID_LESSON_ORDER'
      );
    }

    const todasPertenecen = ordenIds.every((id) => idsDelCurso.includes(Number(id)));

    if (!todasPertenecen) {
      throw new AppError(
        'El nuevo orden incluye lecciones que no pertenecen al curso.',
        422,
        'INVALID_LESSON_ORDER'
      );
    }

    await leccionRepository.reorder(
      ordenIds.map((id, indice) => ({ id: Number(id), orden: indice + 1 }))
    );

    return { lecciones: await leccionRepository.findByCurso(curso.id) };
  },
};
