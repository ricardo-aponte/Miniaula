import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { AppError } from './errors/AppError.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Seguridad y middlewares globales
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));


app.use('/api', routes);

// Ruta no encontrada (404)
app.use((req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
});

// Manejo centralizado de errores
app.use(errorHandler);

export default app;