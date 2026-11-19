import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const Pregunta = sequelize.define(
  'Pregunta',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    enunciado: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    opciones: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    indiceCorrecto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'indice_correcto',
    },
    leccionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'leccion_id',
    },
  },
  {
    tableName: 'preguntas',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['indiceCorrecto'] },
    },
    scopes: {
      conRespuesta: {
        attributes: { include: ['indiceCorrecto'] },
      },
    },
  }
);