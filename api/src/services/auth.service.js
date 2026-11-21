import bcrypt from 'bcrypt';
import { usuarioRepository } from '../repositories/usuario.repository.js';
import { AppError } from '../errors/AppError.js';
import { signAccessToken } from '../utils/jwt.js';

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
};