import bcrypt from 'bcrypt';
import { usuarioRepository } from '../repositories/usuario.repository.js';
import { tokenRecuperacionRepository } from '../repositories/tokenRecuperacion.repository.js';
import { AppError } from '../errors/AppError.js';
import { signAccessToken } from '../utils/jwt.js';
import { generateRandomToken, hashToken } from '../utils/text.js';
import { LONGITUD_TOKEN_RECUPERACION } from '../config/constants.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 10;

function toSafeUser(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    creadoEn: usuario.creadoEn,
  };
}

export const authService = {
  async register({ nombre, email, password, rol }) {
    const existente = await usuarioRepository.findByEmail(email);
    if (existente) {
      throw new AppError('Ya existe una cuenta registrada con ese email.', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const usuario = await usuarioRepository.create({
      nombre,
      email,
      passwordHash,
      rol,
    });

    const token = signAccessToken(usuario);
    return { user: toSafeUser(usuario), token };
  },

  async login({ email, password }) {
    const usuario = await usuarioRepository.findByEmail(email, { includePassword: true });
    if (!usuario) {
      throw new AppError('Credenciales inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValido) {
      throw new AppError('Credenciales inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const token = signAccessToken(usuario);
    return { user: toSafeUser(usuario), token };
  },

  /**
   * Genera un token de recuperación de un solo uso.
   * Responde siempre igual para no revelar si el email está registrado.
   */
  async forgotPassword({ email }) {
    const respuesta = {
      message:
        'Si el email está registrado, recibirás las instrucciones para restablecer tu contraseña.',
    };

    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
      return respuesta;
    }

    // Un pedido nuevo invalida los tokens anteriores del mismo usuario.
    await tokenRecuperacionRepository.deleteByUsuarioId(usuario.id);

    const token = generateRandomToken(LONGITUD_TOKEN_RECUPERACION);
    const expiraEn = new Date(Date.now() + env.passwordReset.ttlMinutes * 60 * 1000);

    await tokenRecuperacionRepository.create({
      usuarioId: usuario.id,
      tokenHash: hashToken(token),
      expiraEn,
    });

    // Sin servicio de correo todavía: en desarrollo el token se devuelve para
    // poder probar el flujo. En producción nunca debe viajar en la respuesta.
    if (env.nodeEnv !== 'production') {
      respuesta.resetToken = token;
      respuesta.expiraEn = expiraEn.toISOString();
    }

    return respuesta;
  },

  async resetPassword({ token, password }) {
    const registro = await tokenRecuperacionRepository.findVigenteByHash(hashToken(token));
    if (!registro) {
      throw new AppError(
        'El token de recuperación es inválido o ya expiró.',
        400,
        'INVALID_RESET_TOKEN'
      );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await tokenRecuperacionRepository.consumeAndResetPassword({
      usuarioId: registro.usuarioId,
      passwordHash,
    });

    return { message: 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.' };
  },
};
