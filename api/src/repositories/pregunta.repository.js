import { Pregunta } from '../db/models/index.js';

export const preguntaRepository = {
  findByLeccion(leccionId) {
    return Pregunta.findAll({
      where: { leccionId },
      order: [['id', 'ASC']],
    });
  },

  findByLeccionConRespuesta(leccionId) {
    return Pregunta.scope('conRespuesta').findAll({
      where: { leccionId },
      order: [['id', 'ASC']],
    });
  },

  findByLeccionIdsConRespuesta(leccionIds) {
    if (!leccionIds.length) return [];

    return Pregunta.scope('conRespuesta').findAll({
      where: { leccionId: leccionIds },
      order: [
        ['leccionId', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  },

  findById(preguntaId) {
    return Pregunta.findByPk(preguntaId);
  },

  findByIdConRespuesta(preguntaId) {
    return Pregunta.scope('conRespuesta').findByPk(preguntaId);
  },

  create(data) {
    return Pregunta.create(data);
  },

  async updateById(preguntaId, data) {
    await Pregunta.update(data, { where: { id: preguntaId } });
    return Pregunta.findByPk(preguntaId);
  },

  deleteById(preguntaId) {
    return Pregunta.destroy({ where: { id: preguntaId } });
  },

  countByLeccion(leccionId) {
    return Pregunta.count({ where: { leccionId } });
  },
};
