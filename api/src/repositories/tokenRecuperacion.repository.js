import { Op } from 'sequelize';
import { sequelize, TokenRecuperacion, Usuario } from '../db/models/index.js';

export const tokenRecuperacionRepository = {
  create(data) {
    return TokenRecuperacion.create(data);
  },

  /** Busca un token que no haya sido usado y que siga vigente. */
  findVigenteByHash(tokenHash) {
    return TokenRecuperacion.findOne({
      where: {
        tokenHash,
        usadoEn: null,
        expiraEn: { [Op.gt]: new Date() },
      },
    });
  },

  async deleteByUsuarioId(usuarioId) {
    await TokenRecuperacion.destroy({ where: { usuarioId } });
  },

  /**
   * Consume el token y actualiza la contraseña en una sola transacción:
   * invalida todos los tokens pendientes del usuario y cambia el passwordHash.
   */
  consumeAndResetPassword({ usuarioId, passwordHash }) {
    return sequelize.transaction(async (transaction) => {
      await TokenRecuperacion.update(
        { usadoEn: new Date() },
        { where: { usuarioId, usadoEn: null }, transaction }
      );

      await Usuario.update({ passwordHash }, { where: { id: usuarioId }, transaction });
    });
  },
};
