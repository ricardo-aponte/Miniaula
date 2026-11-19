'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cursos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nivel: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM('borrador', 'publicado', 'archivado'),
        allowNull: false,
        defaultValue: 'borrador',
      },
      instructor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('cursos', ['estado', 'categoria'], {
      name: 'idx_cursos_estado_categoria',
    });
    await queryInterface.addIndex('cursos', ['instructor_id'], {
      name: 'idx_cursos_instructor',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cursos');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_cursos_estado";');
  },
};