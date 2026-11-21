import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, rol: usuario.rol },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.secret);
}