import { leccionRepository } from '../repositories/leccion.repository.js';
import { progresoRepository } from '../repositories/progreso.repository.js';
import { inscripcionRepository } from '../repositories/inscripcion.repository.js';
import { preguntaRepository } from '../repositories/pregunta.repository.js';
import { AppError } from '../errors/AppError.js';
import { MAX_INTENTOS_CUESTIONARIO, NOTA_MINIMA_POR_DEFECTO } from '../config/constants.js';
import { buildLessonStates, calcularPorcentajeAvance } from '../utils/progress.js';
import { toPreguntaPublica } from '../utils/serializers.js';

async function obtenerEstadosLecciones(cursoId, inscripcionId) {
  const [lecciones, progresos] = await Promise.all([
    leccionRepository.findByCurso(cursoId),
    progresoRepository.listByInscripcion(inscripcionId),
  ]);

  return buildLessonStates(lecciones, progresos);
}

function buscarEstado(estados, leccionId) {
  return estados.find((estado) => Number(estado.id) === Number(leccionId));
}

function assertDesbloqueada(estado, leccion) {
  if (!estado || !estado.desbloqueada) {
    throw new AppError(
      'La lección está bloqueada: primero debes completar las lecciones anteriores.',
      403,
      'LESSON_LOCKED',
      { leccion: { id: leccion.id, titulo: leccion.titulo, orden: leccion.orden } }
    );
  }
}

async function obtenerOCrearProgreso(inscripcionId, leccionId) {
  const existente = await progresoRepository.findByInscripcionYLeccion(inscripcionId, leccionId);

  if (existente) {
    return existente;
  }

  return progresoRepository.create({ inscripcionId, leccionId });
}

async function sincronizarInscripcion(curso, inscripcion) {
  const [total, progresos] = await Promise.all([
    leccionRepository.countByCurso(curso.id),
    progresoRepository.listByInscripcion(inscripcion.id),
  ]);

  const completadas = progresos.filter((progreso) => progreso.completada).length;
  const completado = total > 0 && completadas >= total;

  if (Boolean(inscripcion.completado) !== completado) {
    await inscripcionRepository.updateById(inscripcion.id, { completado });
    inscripcion.completado = completado;
  }

  return { completado, completadas, total };
}

function construirRespuestaCuestionario(leccion, progreso) {
  const intentos = progreso.intentos ?? 0;

  return {
    intentos,
    intentosRestantes: Math.max(MAX_INTENTOS_CUESTIONARIO - intentos, 0),
    mejorNota: progreso.mejorNota === null || progreso.mejorNota === undefined
      ? null
      : Number(progreso.mejorNota),
    notaMinima: leccion.notaMinima ?? NOTA_MINIMA_POR_DEFECTO,
  };
}

export const progresoService = {
  async getLeccion(leccion, curso, inscripcion) {
    const estados = await obtenerEstadosLecciones(curso.id, inscripcion.id);
    const estado = buscarEstado(estados, leccion.id);

    assertDesbloqueada(estado, leccion);

    if (leccion.tipo === 'contenido') {
      return {
        leccion: {
          id: leccion.id,
          titulo: leccion.titulo,
          tipo: leccion.tipo,
          orden: leccion.orden,
          contenido: leccion.contenido,
          videoUrl: leccion.videoUrl,
        },
        progreso: estado,
      };
    }

    const preguntas = await preguntaRepository.findByLeccion(leccion.id);

    return {
      leccion: {
        id: leccion.id,
        titulo: leccion.titulo,
        tipo: leccion.tipo,
        orden: leccion.orden,
        preguntas: preguntas.map(toPreguntaPublica),
      },
      progreso: estado,
      cuestionario: construirRespuestaCuestionario(leccion, {
        intentos: estado.intentos,
        mejorNota: estado.mejorNota,
      }),
    };
  },

  async completarLeccion(leccion, curso, inscripcion) {
    if (leccion.tipo !== 'contenido') {
      throw new AppError(
        'Solo las lecciones de contenido se marcan como completadas; los cuestionarios se aprueban rindiendo un intento.',
        422,
        'NOT_CONTENT_LESSON'
      );
    }

    const estados = await obtenerEstadosLecciones(curso.id, inscripcion.id);
    const estado = buscarEstado(estados, leccion.id);

    assertDesbloqueada(estado, leccion);

    if (!estado.completada) {
      const progreso = await obtenerOCrearProgreso(inscripcion.id, leccion.id);
      await progresoRepository.update(progreso, { completada: true });
    }

    const estadosActualizados = await obtenerEstadosLecciones(curso.id, inscripcion.id);
    const sincronizacion = await sincronizarInscripcion(curso, inscripcion);

    return {
      progreso: buscarEstado(estadosActualizados, leccion.id),
      porcentajeAvance: calcularPorcentajeAvance(estadosActualizados),
      inscripcionCompletada: sincronizacion.completado,
    };
  },

  async rendirIntento(leccion, curso, inscripcion, respuestas) {
    if (leccion.tipo !== 'cuestionario') {
      throw new AppError(
        'Solo las lecciones de tipo cuestionario admiten intentos.',
        422,
        'NOT_QUIZ_LESSON'
      );
    }

    const estados = await obtenerEstadosLecciones(curso.id, inscripcion.id);
    const estado = buscarEstado(estados, leccion.id);

    assertDesbloqueada(estado, leccion);

    const preguntas = await preguntaRepository.findByLeccionConRespuesta(leccion.id);

    if (preguntas.length === 0) {
      throw new AppError(
        'El cuestionario todavía no tiene preguntas configuradas.',
        422,
        'QUIZ_WITHOUT_QUESTIONS'
      );
    }

    const respuestasPorPregunta = new Map();

    for (const respuesta of respuestas) {
      const preguntaId = Number(respuesta.preguntaId);

      if (respuestasPorPregunta.has(preguntaId)) {
        throw new AppError(
          'No puedes enviar dos respuestas para la misma pregunta.',
          422,
          'DUPLICATED_ANSWER',
          { preguntaId }
        );
      }

      respuestasPorPregunta.set(preguntaId, Number(respuesta.opcion));
    }

    const faltantes = [];

    for (const pregunta of preguntas) {
      const opcion = respuestasPorPregunta.get(Number(pregunta.id));

      if (opcion === undefined) {
        faltantes.push(pregunta.id);
        continue;
      }

      if (opcion < 0 || opcion >= pregunta.opciones.length) {
        throw new AppError(
          'La opción elegida no existe en la pregunta.',
          422,
          'INVALID_ANSWER_OPTION',
          { preguntaId: pregunta.id }
        );
      }
    }

    if (faltantes.length > 0) {
      throw new AppError(
        'Debes responder todas las preguntas del cuestionario.',
        422,
        'INCOMPLETE_ANSWERS',
        { preguntasFaltantes: faltantes }
      );
    }

    const correctas = preguntas.filter(
      (pregunta) => respuestasPorPregunta.get(Number(pregunta.id)) === Number(pregunta.indiceCorrecto)
    ).length;

    const nota = Math.round((correctas / preguntas.length) * 10000) / 100;
    const progreso = await obtenerOCrearProgreso(inscripcion.id, leccion.id);
    const intentosPrevios = progreso.intentos ?? 0;

    if (intentosPrevios >= MAX_INTENTOS_CUESTIONARIO) {
      throw new AppError(
        'Alcanzaste el máximo de intentos permitidos para este cuestionario.',
        422,
        'MAX_ATTEMPTS_REACHED',
        { intentos: intentosPrevios, maximo: MAX_INTENTOS_CUESTIONARIO }
      );
    }

    const mejorNota =
      progreso.mejorNota === null || progreso.mejorNota === undefined
        ? nota
        : Math.max(Number(progreso.mejorNota), nota);

    const notaMinima = leccion.notaMinima ?? NOTA_MINIMA_POR_DEFECTO;
    const aprobado = mejorNota >= notaMinima;
    const completada = Boolean(progreso.completada) || aprobado;

    await progresoRepository.update(progreso, {
      intentos: intentosPrevios + 1,
      mejorNota,
      completada,
    });

    const estadosActualizados = await obtenerEstadosLecciones(curso.id, inscripcion.id);
    const sincronizacion = await sincronizarInscripcion(curso, inscripcion);

    return {
      resultado: {
        nota,
        aprobado,
        mejorNota,
        notaMinima,
        intento: intentosPrevios + 1,
        intentosRestantes: MAX_INTENTOS_CUESTIONARIO - (intentosPrevios + 1),
        completada,
      },
      porcentajeAvance: calcularPorcentajeAvance(estadosActualizados),
      inscripcionCompletada: sincronizacion.completado,
    };
  },

  async getCursoProgreso(curso, inscripcion) {
    const estados = await obtenerEstadosLecciones(curso.id, inscripcion.id);

    return {
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        totalLecciones: estados.length,
      },
      inscripcion: {
        id: inscripcion.id,
        completado: Boolean(inscripcion.completado),
      },
      porcentajeAvance: calcularPorcentajeAvance(estados),
      lecciones: estados,
    };
  },
};
