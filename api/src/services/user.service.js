import bcrypt from 'bcrypt';
import { usuarioRepository } from '../repositories/usuario.repository.js';
import { AppError } from '../errors/AppError.js';

const SALT_ROUNDS = 10;

export const userService = {
  async getProfile(userId) {
    const usuario = await usuarioRepository.findById(userId);
    if (!usuario) {
      throw new AppError('Usuario no encontrado.', 404, 'USER_NOT_FOUND');
    }
    return usuario;
  },

  async updateProfile(userId, { nombre, email, password }) {
    const usuarioActual = await usuarioRepository.findById(userId);
    if (!usuarioActual) {
      throw new AppError('Usuario no encontrado.', 404, 'USER_NOT_FOUND');
    }

    const datosActualizar = {};

    if (nombre !== undefined) {
      datosActualizar.nombre = nombre;
    }

    if (email !== undefined && email !== usuarioActual.email) {
      const otroUsuario = await usuarioRepository.findByEmail(email);
      if (otroUsuario) {
        throw new AppError('Ese email ya está en uso por otra cuenta.', 409, 'EMAIL_EXISTS');
      }
      datosActualizar.email = email;
    }

    if (password !== undefined) {
      datosActualizar.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return usuarioRepository.updateById(userId, datosActualizar);
  },
};