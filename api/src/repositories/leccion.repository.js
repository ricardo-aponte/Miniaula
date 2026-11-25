import { Leccion, sequelize } from '../db/models/index.js';

export const leccionRepository = {
  findByCurso(cursoId) {
    return Leccion.findAll({
      where: { cursoId },
      order: [
        ['orden', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  },

  findById(leccionId) {
    return Leccion.findByPk(leccionId);
  },

  create(data) {
    return Leccion.create(data);
  },

  async updateById(leccionId, data) {
    await Leccion.update(data, { where: { id: leccionId } });
    return Leccion.findByPk(leccionId);
  },

  deleteById(leccionId) {
    return Leccion.destroy({ where: { id: leccionId } });
  },

  countByCurso(cursoId) {
    return Leccion.count({ where: { cursoId } });
  },

  async countByCursos(cursoIds) {
    if (!cursoIds.length) return {};

    const rows = await Leccion.findAll({
      where: { cursoId: cursoIds },
      attributes: ['cursoId', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
      group: ['cursoId'],
      raw: true,
    });

    return rows.reduce((acumulado, fila) => {
      acumulado[fila.cursoId] = Number(fila.total);
      return acumulado;
    }, {});
  },

  maxOrden(cursoId) {
    return Leccion.max('orden', { where: { cursoId } });
  },

  async reorder(items) {
    await sequelize.transaction(async (transaction) => {
      for (const item of items) {
        await Leccion.update(
          { orden: item.orden },
          { where: { id: item.id }, transaction }
        );
      }
    });
  },
};
