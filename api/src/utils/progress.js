// Helpers para calcular el desbloqueo secuencial (RN-01) y el avance de un curso.

function toNumero(valor) {
  return valor === null || valor === undefined ? null : Number(valor);
}

export function toProgresoResumen(progreso) {
  if (!progreso) {
    return { completada: false, intentos: 0, mejorNota: null };
  }

  return {
    completada: Boolean(progreso.completada),
    intentos: progreso.intentos ?? 0,
    mejorNota: toNumero(progreso.mejorNota),
  };
}

/**
 * Recorre las lecciones en orden y determina cuáles están desbloqueadas.
 * Una lección está desbloqueada solo si todas las anteriores están completadas
 * (para los cuestionarios "completada" equivale a "aprobado").
 */
export function buildLessonStates(lecciones, progresos) {
  const progresosPorLeccion = new Map(
    (progresos ?? []).map((progreso) => [Number(progreso.leccionId), progreso])
  );

  let anterioresCompletadas = true;

  return (lecciones ?? []).map((leccion) => {
    const estadoProgreso = toProgresoResumen(progresosPorLeccion.get(Number(leccion.id)));

    const estado = {
      id: leccion.id,
      titulo: leccion.titulo,
      tipo: leccion.tipo,
      orden: leccion.orden,
      notaMinima: leccion.notaMinima ?? null,
      desbloqueada: anterioresCompletadas,
      ...estadoProgreso,
    };

    anterioresCompletadas = anterioresCompletadas && estadoProgreso.completada;

    return estado;
  });
}

export function calcularPorcentajeAvance(estados) {
  const total = estados?.length ?? 0;
  if (total === 0) return 0;

  const completadas = estados.filter((estado) => estado.completada).length;
  return Math.round((completadas / total) * 100);
}
