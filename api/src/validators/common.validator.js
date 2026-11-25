import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El ID debe ser un número.' })
    .int('El ID debe ser un número entero.')
    .positive('El ID debe ser mayor a 0.'),
});

export const paginationQuerySchema = z.object({
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
});
