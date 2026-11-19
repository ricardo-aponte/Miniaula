'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inscripciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      estudiante_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      curso_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cursos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      fecha_inscripcion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      completado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    await queryInterface.addConstraint('inscripciones', {
      fields: ['estudiante_id', 'curso_id'],
      type: 'unique',
      name: 'uq_inscripcion_estudiante_curso',
    });

    await queryInterface.addIndex('inscripciones', ['curso_id'], {
      name: 'idx_inscripciones_curso',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inscripciones');
  },
};