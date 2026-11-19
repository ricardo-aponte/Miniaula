import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    rol: {
      type: DataTypes.ENUM('estudiante', 'instructor'),
      allowNull: false,
    },
    creadoEn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'creado_en',
    },
  },
  {
    tableName: 'usuarios',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      conPassword: {
        attributes: { include: ['passwordHash'] },
      },
    },
  }
);