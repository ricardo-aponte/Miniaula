import { Usuario } from '../db/models/index.js';

export const usuarioRepository = {
  findByEmail(email, { includePassword = false } = {}) {
    const model = includePassword ? Usuario.scope('conPassword') : Usuario;
    return model.findOne({ where: { email } });
  },

  findById(id, { includePassword = false } = {}) {
    const model = includePassword ? Usuario.scope('conPassword') : Usuario;
    return model.findByPk(id);
  },

  create(data) {
    return Usuario.create(data);
  },

  async updateById(id, data) {
    await Usuario.update(data, { where: { id } });
    return Usuario.findByPk(id);
  },
};