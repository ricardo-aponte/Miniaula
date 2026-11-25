// Constantes de dominio compartidas entre validadores, servicios y controladores.

export const ESTADOS_CURSO = ['borrador', 'publicado', 'archivado'];

export const NIVELES_CURSO = ['principiante', 'intermedio', 'avanzado'];

export const TIPOS_LECCION = ['contenido', 'cuestionario'];

// RN-03: máximo de intentos por cuestionario.
export const MAX_INTENTOS_CUESTIONARIO = 3;

// Nota mínima por defecto cuando una lección de tipo cuestionario no la define.
export const NOTA_MINIMA_POR_DEFECTO = 60;
