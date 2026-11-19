'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preguntas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      enunciado: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      opciones: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      indice_correcto: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      leccion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'lecciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addIndex('preguntas', ['leccion_id'], {
      name: 'idx_preguntas_leccion',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('preguntas');
  },
};