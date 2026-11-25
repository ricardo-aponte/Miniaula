import { z } from 'zod';

const enunciadoSchema = z
  .string({ required_error: 'El enunciado es obligatorio.' })
  .trim()
  .min(5, 'El enunciado debe tener al menos 5 caracteres.')
  .max(1000, 'El enunciado no puede superar 1000 caracteres.');

const opcionesSchema = z
  .array(
    z
      .string({ required_error: 'Cada opción debe ser texto.' })
      .trim()
      .min(1, 'Las opciones no pueden estar vacías.')
      .max(300, 'Cada opción no puede superar 300 caracteres.')
  )
  .min(2, 'Debes enviar al menos 2 opciones.')
  .max(6, 'No puedes enviar más de 6 opciones.');

const indiceCorrectoSchema = z.coerce
  .number({ invalid_type_error: 'El índice correcto debe ser un número.' })
  .int('El índice correcto debe ser un número entero.')
  .min(0, 'El índice correcto no puede ser negativo.');

export const createPreguntaSchema = z
  .object({
    enunciado: enunciadoSchema,
    opciones: opcionesSchema,
    indiceCorrecto: indiceCorrectoSchema,
  })
  .superRefine((data, ctx) => {
    if (data.indiceCorrecto >= data.opciones.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['indiceCorrecto'],
        message: 'El índice correcto debe apuntar a una de las opciones enviadas.',
      });
    }
  });

export const updatePreguntaSchema = z
  .object({
    enunciado: enunciadoSchema.optional(),
    opciones: opcionesSchema.optional(),
    indiceCorrecto: indiceCorrectoSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar la pregunta.',
  });
