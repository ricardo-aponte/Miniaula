import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio.' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(120, 'El nombre no puede superar 120 caracteres.'),
  email: z
    .string({ required_error: 'El email es obligatorio.' })
    .trim()
    .toLowerCase()
    .email('El formato del email no es válido.')
    .max(150),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(72, 'La contraseña no puede superar 72 caracteres.'),
  rol: z.enum(['estudiante', 'instructor'], {
    errorMap: () => ({ message: 'El rol debe ser "estudiante" o "instructor".' }),
  }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio.' })
    .trim()
    .toLowerCase()
    .email('El formato del email no es válido.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(1, 'La contraseña es obligatoria.'),
});

export const updateProfileSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres.')
      .max(120)
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('El formato del email no es válido.')
      .max(150)
      .optional(),
    password: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
      .max(72)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar.',
  });