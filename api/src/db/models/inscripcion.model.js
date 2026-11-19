import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const Inscripcion = sequelize.define(
  'Inscripcion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'estudiante_id',
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'curso_id',
    },
    fechaInscripcion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'fecha_inscripcion',
    },
    completado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'inscripciones',
    timestamps: false,
  }
);