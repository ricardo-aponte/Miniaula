'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens_recuperacion', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      token_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      expira_en: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      usado_en: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      creado_en: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('tokens_recuperacion', ['usuario_id'], {
      name: 'idx_tokens_recuperacion_usuario',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tokens_recuperacion');
  },
};
