import { Curso, Inscripcion, Leccion, Pregunta } from '../db/models/index.js';

export const resourceAuthRepository = {
  findCursoById(cursoId) {
    return Curso.findByPk(cursoId);
  },

  findLeccionWithCurso(leccionId) {
    return Leccion.findByPk(leccionId, {
      include: [{ model: Curso, as: 'curso' }],
    });
  },

  findPreguntaWithCurso(preguntaId) {
    return Pregunta.findByPk(preguntaId, {
      include: [
        {
          model: Leccion,
          as: 'leccion',
          include: [{ model: Curso, as: 'curso' }],
        },
      ],
    });
  },

  findInscripcion(estudianteId, cursoId) {
    return Inscripcion.findOne({
      where: { estudianteId, cursoId },
    });
  },
};