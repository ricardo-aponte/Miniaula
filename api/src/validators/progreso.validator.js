import { z } from 'zod';

export const intentoCuestionarioSchema = z.object({
  respuestas: z
    .array(
      z.object({
        preguntaId: z.coerce
          .number({ invalid_type_error: 'El ID de la pregunta debe ser un número.' })
          .int('El ID de la pregunta debe ser un número entero.')
          .positive('El ID de la pregunta debe ser mayor a 0.'),
        opcion: z.coerce
          .number({ invalid_type_error: 'La opción elegida debe ser un número.' })
          .int('La opción elegida debe ser un número entero.')
          .min(0, 'La opción elegida no puede ser negativa.'),
      })
    )
    .min(1, 'Debes enviar al menos una respuesta.'),
});
