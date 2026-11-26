// La API responde siempre { error: { code, message, details } }.
export const getApiError = (error, fallback = 'Ocurrió un error inesperado.') =>
  error?.response?.data?.error?.message ?? fallback;

export const getApiErrorCode = (error) => error?.response?.data?.error?.code ?? null;
