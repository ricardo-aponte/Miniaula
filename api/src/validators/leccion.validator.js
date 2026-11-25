import { z } from 'zod';

const tituloSchema = z
  .string({ required_error: 'El título es obligatorio.' })
  .trim()
  .min(3, 'El título debe tener al menos 3 caracteres.')
  .max(200, 'El título no puede superar 200 caracteres.');

const contenidoSchema = z
  .string()
  .trim()
  .max(20000, 'El contenido no puede superar 20000 caracteres.');

const videoUrlSchema = z
  .string()
  .trim()
  .url('El enlace del video no es una URL válida.')
  .max(500, 'El enlace no puede superar 500 caracteres.');

const notaMinimaSchema = z.coerce
  .number({ invalid_type_error: 'La nota mínima debe ser un número.' })
  .int('La nota mínima debe ser un número entero.')
  .min(0, 'La nota mínima no puede ser menor a 0.')
  .max(100, 'La nota mínima no puede ser mayor a 100.');

export const createLeccionSchema = z
  .object({
    titulo: tituloSchema,
    tipo: z.enum(['contenido', 'cuestionario'], {
      errorMap: () => ({ message: 'El tipo debe ser "contenido" o "cuestionario".' }),
    }),
    contenido: contenidoSchema.optional(),
    videoUrl: videoUrlSchema.optional(),
    notaMinima: notaMinimaSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'contenido' && !data.contenido && !data.videoUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['contenido'],
        message: 'Una lección de contenido requiere texto o un enlace de video.',
      });
    }

    if (data.tipo === 'cuestionario' && data.notaMinima === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['notaMinima'],
        message: 'La nota mínima es obligatoria para un cuestionario.',
      });
    }
  });

export const updateLeccionSchema = z
  .object({
    titulo: tituloSchema.optional(),
    contenido: contenidoSchema.nullable().optional(),
    videoUrl: videoUrlSchema.nullable().optional(),
    notaMinima: notaMinimaSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar la lección.',
  });

export const reorderLeccionesSchema = z.object({
  orden: z
    .array(
      z.coerce
        .number({ invalid_type_error: 'Cada elemento del orden debe ser un ID numérico.' })
        .int('Cada ID del orden debe ser un número entero.')
        .positive('Cada ID del orden debe ser mayor a 0.')
    )
    .min(1, 'Debes enviar al menos una lección en el nuevo orden.'),
});
