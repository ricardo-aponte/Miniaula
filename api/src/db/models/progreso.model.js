import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const Progreso = sequelize.define(
  'Progreso',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    inscripcionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'inscripcion_id',
    },
    leccionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'leccion_id',
    },
    completada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    intentos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    mejorNota: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'mejor_nota',
    },
    actualizadoEn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'actualizado_en',
    },
  },
  {
    tableName: 'progresos',
    timestamps: true,
    createdAt: false,
    updatedAt: 'actualizadoEn',
  }
);