import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El ID debe ser un número.' })
    .int('El ID debe ser un número entero.')
    .positive('El ID debe ser mayor a 0.'),
});