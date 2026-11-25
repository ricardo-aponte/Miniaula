import { cursoRepository } from '../repositories/curso.repository.js';
import { inscripcionRepository } from '../repositories/inscripcion.repository.js';
import { leccionRepository } from '../repositories/leccion.repository.js';
import { AppError } from '../errors/AppError.js';
import { toPlain } from '../utils/serializers.js';

function toInscripcionResumen(inscripcion) {
  const data = toPlain(inscripcion);

  return {
    id: data.id,
    fechaInscripcion: data.fechaInscripcion,
    completado: Boolean(data.completado),
  };
}

export const inscripcionService = {
  async enroll(cursoId, estudianteId) {
    const curso = await cursoRepository.findById(cursoId);

    if (!curso) {
      throw new AppError('Curso no encontrado.', 404, 'COURSE_NOT_FOUND');
    }

    if (curso.estado !== 'publicado') {
      throw new AppError(
        'Solo puedes inscribirte en cursos publicados.',
        422,
        'COURSE_NOT_PUBLISHED'
      );
    }

    const existente = await inscripcionRepository.findByEstudianteAndCurso(estudianteId, cursoId);

    if (existente) {
      throw new AppError('Ya estás inscrito en este curso.', 409, 'ALREADY_ENROLLED');
    }

    try {
      const inscripcion = await inscripcionRepository.create({ estudianteId, cursoId });

      return {
        inscripcion: toInscripcionResumen(inscripcion),
        curso: { id: curso.id, titulo: curso.titulo },
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('Ya estás inscrito en este curso.', 409, 'ALREADY_ENROLLED');
      }
      throw error;
    }
  },

  async listMias(estudianteId) {
    const inscripciones = await inscripcionRepository.listByEstudiante(estudianteId);

    const cursosIds = [...new Set(inscripciones.map((inscripcion) => Number(inscripcion.cursoId)))];
    const totalesPorCurso = await leccionRepository.countByCursos(cursosIds);

    return {
      inscripciones: inscripciones.map((inscripcion) => {
        const data = toPlain(inscripcion);
        const totalLecciones = totalesPorCurso[Number(data.cursoId)] ?? 0;
        const leccionesCompletadas = (data.progresos ?? []).filter(
          (progreso) => progreso.completada
        ).length;
        const porcentajeAvance =
          totalLecciones === 0 ? 0 : Math.round((leccionesCompletadas / totalLecciones) * 100);

        return {
          id: data.id,
          curso: data.curso,
          fechaInscripcion: data.fechaInscripcion,
          completado: Boolean(data.completado),
          totalLecciones,
          leccionesCompletadas,
          porcentajeAvance,
        };
      }),
    };
  },
};
