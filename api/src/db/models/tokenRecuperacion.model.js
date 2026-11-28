import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

// Tokens de un solo uso para restablecer la contraseña.
// Se guarda únicamente el hash (SHA-256), nunca el token en claro.
export const TokenRecuperacion = sequelize.define(
  'TokenRecuperacion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id',
    },
    tokenHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      field: 'token_hash',
    },
    expiraEn: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expira_en',
    },
    usadoEn: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'usado_en',
    },
    creadoEn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'creado_en',
    },
  },
  {
    tableName: 'tokens_recuperacion',
    timestamps: false,
  }
);
