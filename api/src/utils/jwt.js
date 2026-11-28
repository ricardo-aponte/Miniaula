import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, rol: usuario.rol },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

// Deja propagar el error (TokenExpiredError / JsonWebTokenError) para que
// auth.middleware.js responda 401 con el código correcto. No se registra el
// token ni el secreto en consola.
export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.secret);
}
