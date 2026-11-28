// Helpers de tokens de un solo uso. Adaptados de `expressapi/utils/text.utils.js`
// a ESM, usando `node:crypto` (sin la dependencia `sha1`, que está obsoleta).

import { createHash, randomBytes } from 'node:crypto';

const TOKEN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_TOKEN_LENGTH = 32;
const HASH_ALGORITHM = 'sha256';

/**
 * Hash de un solo sentido para guardar tokens de un solo uso (recuperación de
 * contraseña, verificación de email). Nunca se guarda el token en claro.
 */
export function hashToken(token) {
  return createHash(HASH_ALGORITHM).update(String(token)).digest('hex');
}

/**
 * Token aleatorio criptográficamente seguro (no usa `Math.random`).
 * Se descartan los bytes que introducirían sesgo de módulo.
 */
export function generateRandomToken(length = DEFAULT_TOKEN_LENGTH) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError('La longitud del token debe ser un entero positivo.');
  }

  const limite = Math.floor(256 / TOKEN_ALPHABET.length) * TOKEN_ALPHABET.length;
  let token = '';

  while (token.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte >= limite) continue;
      token += TOKEN_ALPHABET[byte % TOKEN_ALPHABET.length];
      if (token.length === length) break;
    }
  }

  return token;
}
