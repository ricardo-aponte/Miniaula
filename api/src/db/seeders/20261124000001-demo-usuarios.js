'use strict';

const bcrypt = require('bcrypt');
const { Op, QueryTypes } = require('sequelize');

const PASSWORD_DEMO = 'Demo1234';

const USUARIOS = [
  { nombre: 'Ana Torres', email: 'ana@miniaula.com', rol: 'instructor' },
  { nombre: 'Carlos Ruiz', email: 'carlos@miniaula.com', rol: 'instructor' },
  { nombre: 'Juan Pérez', email: 'juan@miniaula.com', rol: 'estudiante' },
  { nombre: 'María López', email: 'maria@miniaula.com', rol: 'estudiante' },
  { nombre: 'Pedro Gómez', email: 'pedro@miniaula.com', rol: 'estudiante' },
];

module.exports = {
  async up(queryInterface) {
    const emails = USUARIOS.map((usuario) => usuario.email);

    const existentes = await queryInterface.sequelize.query(
      'SELECT email FROM usuarios WHERE email IN (:emails);',
      { replacements: { emails }, type: QueryTypes.SELECT }
    );

    const emailsExistentes = new Set(existentes.map((usuario) => usuario.email));
    const nuevos = USUARIOS.filter((usuario) => !emailsExistentes.has(usuario.email));

    if (nuevos.length === 0) {
      return;
    }

    const passwordHash = await bcrypt.hash(PASSWORD_DEMO, 10);
    const creadoEn = new Date();

    await queryInterface.bulkInsert(
      'usuarios',
      nuevos.map((usuario) => ({
        ...usuario,
        password_hash: passwordHash,
        creado_en: creadoEn,
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', {
      email: { [Op.in]: USUARIOS.map((usuario) => usuario.email) },
    });
  },
};
