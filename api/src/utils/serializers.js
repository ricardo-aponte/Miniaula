// Serializadores que garantizan que nunca se expongan datos sensibles (RN-02).

export function toPlain(entity) {
  return typeof entity?.toJSON === 'function' ? entity.toJSON() : entity;
}

/** Devuelve la pregunta sin `indiceCorrecto`. */
export function toPreguntaPublica(pregunta) {
  const data = toPlain(pregunta) ?? {};
  const { indiceCorrecto, ...resto } = data;
  return resto;
}

/** Devuelve una lección sin el contenido cuando está bloqueada (RF-10). */
export function toLeccionTemario(leccion) {
  const data = toPlain(leccion) ?? {};

  return {
    id: data.id,
    titulo: data.titulo,
    tipo: data.tipo,
    orden: data.orden,
    notaMinima: data.notaMinima ?? null,
  };
}
