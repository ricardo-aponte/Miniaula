'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('progresos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      inscripcion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'inscripciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      completada: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      intentos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mejor_nota: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      actualizado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addConstraint('progresos', {
      fields: ['inscripcion_id', 'leccion_id'],
      type: 'unique',
      name: 'uq_progreso_inscripcion_leccion',
    });

    await queryInterface.addIndex('progresos', ['leccion_id'], {
      name: 'idx_progresos_leccion',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('progresos');
  },
};