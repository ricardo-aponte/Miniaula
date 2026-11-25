import { z } from 'zod';

const tituloSchema = z
  .string({ required_error: 'El título es obligatorio.' })
  .trim()
  .min(3, 'El título debe tener al menos 3 caracteres.')
  .max(200, 'El título no puede superar 200 caracteres.');

const descripcionSchema = z
  .string({ required_error: 'La descripción es obligatoria.' })
  .trim()
  .min(10, 'La descripción debe tener al menos 10 caracteres.')
  .max(5000, 'La descripción no puede superar 5000 caracteres.');

const categoriaSchema = z
  .string({ required_error: 'La categoría es obligatoria.' })
  .trim()
  .min(2, 'La categoría debe tener al menos 2 caracteres.')
  .max(100, 'La categoría no puede superar 100 caracteres.');

const nivelSchema = z.enum(['principiante', 'intermedio', 'avanzado'], {
  errorMap: () => ({ message: 'El nivel debe ser "principiante", "intermedio" o "avanzado".' }),
});

export const createCursoSchema = z.object({
  titulo: tituloSchema,
  descripcion: descripcionSchema,
  categoria: categoriaSchema,
  nivel: nivelSchema,
});

export const updateCursoSchema = z
  .object({
    titulo: tituloSchema.optional(),
    descripcion: descripcionSchema.optional(),
    categoria: categoriaSchema.optional(),
    nivel: nivelSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar el curso.',
  });

export const estadoCursoSchema = z.object({
  estado: z.enum(['publicado', 'archivado'], {
    errorMap: () => ({ message: 'El estado debe ser "publicado" o "archivado".' }),
  }),
});

export const catalogQuerySchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: 'La página debe ser un número.' })
    .int('La página debe ser un número entero.')
    .min(1, 'La página debe ser mayor o igual a 1.')
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'El límite debe ser un número.' })
    .int('El límite debe ser un número entero.')
    .min(1, 'El límite debe ser mayor o igual a 1.')
    .max(50, 'El límite no puede superar 50.')
    .default(12),
  q: z.string().trim().max(200, 'La búsqueda no puede superar 200 caracteres.').optional(),
  categoria: z.string().trim().max(100, 'La categoría no puede superar 100 caracteres.').optional(),
});
