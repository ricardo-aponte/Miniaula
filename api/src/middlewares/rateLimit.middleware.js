import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10, // máximo 10 intentos por IP cada 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.',
        details: null,
      },
    });
  },
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // máximo 5 solicitudes por IP cada 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message:
          'Demasiadas solicitudes de recuperación de contraseña. Intenta nuevamente en 15 minutos.',
        details: null,
      },
    });
  },
});