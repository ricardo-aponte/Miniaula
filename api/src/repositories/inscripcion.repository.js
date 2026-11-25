import { Curso, Inscripcion, Progreso } from '../db/models/index.js';

export const inscripcionRepository = {
  findByEstudianteAndCurso(estudianteId, cursoId) {
    return Inscripcion.findOne({ where: { estudianteId, cursoId } });
  },

  findById(inscripcionId) {
    return Inscripcion.findByPk(inscripcionId);
  },

  create(data) {
    return Inscripcion.create(data);
  },

  async updateById(inscripcionId, data) {
    await Inscripcion.update(data, { where: { id: inscripcionId } });
    return Inscripcion.findByPk(inscripcionId);
  },

  countByCurso(cursoId) {
    return Inscripcion.count({ where: { cursoId } });
  },

  listByEstudiante(estudianteId) {
    return Inscripcion.findAll({
      where: { estudianteId },
      include: [
        {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'titulo', 'categoria', 'nivel', 'estado', 'creadoEn'],
        },
        {
          model: Progreso,
          as: 'progresos',
          attributes: ['leccionId', 'completada', 'intentos', 'mejorNota'],
        },
      ],
      order: [['fechaInscripcion', 'DESC']],
    });
  },

  listByCursoWithProgresos(cursoId) {
    return Inscripcion.findAll({
      where: { cursoId },
      include: [
        {
          model: Progreso,
          as: 'progresos',
          attributes: ['leccionId', 'completada', 'intentos', 'mejorNota'],
        },
      ],
      order: [['fechaInscripcion', 'ASC']],
    });
  },
};
