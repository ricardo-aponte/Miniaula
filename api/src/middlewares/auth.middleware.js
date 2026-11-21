import { AppError } from '../errors/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticación requerido.', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      rol: payload.rol,
    };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('El token ha expirado.', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Token inválido.', 401, 'INVALID_TOKEN'));
  }
}

export function authorize(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado.', 401, 'UNAUTHORIZED'));
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return next(
        new AppError('No tienes permisos para realizar esta acción.', 403, 'FORBIDDEN')
      );
    }

    return next();
  };
}