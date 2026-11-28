import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5701,
    name: process.env.DB_NAME || 'miniaula',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'contraseña_segura',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  passwordReset: {
    ttlMinutes: Number(process.env.PASSWORD_RESET_TTL_MINUTES) || 30,
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5701',
};