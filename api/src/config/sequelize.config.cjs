require('dotenv').config();

const config = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'miniaula',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5501,
  dialect: 'postgres',
};

module.exports = {
  development: config,
  test: config,
  production: config,
};