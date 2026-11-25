import { Progreso } from '../db/models/index.js';

export const progresoRepository = {
  findByInscripcionYLeccion(inscripcionId, leccionId) {
    return Progreso.findOne({ where: { inscripcionId, leccionId } });
  },

  listByInscripcion(inscripcionId) {
    return Progreso.findAll({ where: { inscripcionId } });
  },

  create(data) {
    return Progreso.create(data);
  },

  async update(progreso, data) {
    await progreso.update(data);
    return progreso;
  },
};
