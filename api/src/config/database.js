import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: 'postgres',
    logging: env.nodeEnv === 'development' ? console.log : false,
    define: {
      underscored: true, 
      timestamps: false,
    },
  }
);

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a PostgreSQL establecida correctamente.');
  } catch (error) {
    console.error(' Error al conectar con PostgreSQL:', error.message);
    throw error;
  }
}