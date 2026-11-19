import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const Leccion = sequelize.define(
  'Leccion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('contenido', 'cuestionario'),
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'video_url',
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notaMinima: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'nota_minima',
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'curso_id',
    },
  },
  {
    tableName: 'lecciones',
    timestamps: false,
  }
);