import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // error lanzar app
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'El cuerpo de la petición no es un JSON válido.',
        details: null,
      },
    });
  }

  // Restricción UNIQUE de Sequelize (ej. email repetido o doble inscripción)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Ya existe un registro con esos datos.',
        details: err.errors?.map((e) => ({ field: e.path, message: e.message })) ?? null,
      },
    });
  }

  // Restricción de llave foránea (ej. intentar borrar un curso con inscritos)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      error: {
        code: 'FOREIGN_KEY_CONFLICT',
        message: 'No se puede completar la operación porque el recurso está en uso o la referencia no existe.',
        details: null,
      },
    });
  }

  // Error 500
  console.error(' Error no controlado:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocurrió un error interno en el servidor.',
      details: env.nodeEnv === 'development' ? err.message : null,
    },
  });
}