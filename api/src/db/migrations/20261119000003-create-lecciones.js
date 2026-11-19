'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lecciones', {
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
      tipo: {
        type: Sequelize.ENUM('contenido', 'cuestionario'),
        allowNull: false,
      },
      contenido: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nota_minima: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      curso_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cursos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addIndex('lecciones', ['curso_id', 'orden'], {
      name: 'idx_lecciones_curso_orden',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('lecciones');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_lecciones_tipo";');
  },
};