import { cursoRepository } from '../repositories/curso.repository.js';
import { inscripcionRepository } from '../repositories/inscripcion.repository.js';
import { leccionRepository } from '../repositories/leccion.repository.js';
import { preguntaRepository } from '../repositories/pregunta.repository.js';
import { AppError } from '../errors/AppError.js';
import { buildPagination } from '../utils/pagination.js';
import { toLeccionTemario, toPlain } from '../utils/serializers.js';

function toCursoResumen(curso) {
  const data = toPlain(curso);

  return {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    categoria: data.categoria,
    nivel: data.nivel,
    estado: data.estado,
    creadoEn: data.creadoEn,
    instructor: data.instructor
      ? { id: data.instructor.id, nombre: data.instructor.nombre }
      : undefined,
  };
}

function toCursoCatalogo(curso, totalLecciones) {
  return {
    ...toCursoResumen(curso),
    totalLecciones,
  };
}

function toCursoInstructor(curso) {
  const data = toPlain(curso);

  return {
    ...toCursoResumen(data),
    lecciones: (data.lecciones ?? []).length,
    inscritos: (data.inscripciones ?? []).length,
  };
}

function agruparPreguntasPorLeccion(preguntas) {
  return (preguntas ?? []).reduce((acumulado, pregunta) => {
    const leccionId = Number(pregunta.leccionId);
    if (!acumulado.has(leccionId)) {
      acumulado.set(leccionId, []);
    }
    acumulado.get(leccionId).push(toPlain(pregunta));
    return acumulado;
  }, new Map());
}

export const cursoService = {
  async listCatalog(filtros) {
    const { rows, count } = await cursoRepository.findPublished(filtros);
    const totalesPorCurso = await leccionRepository.countByCursos(rows.map((row) => row.id));

    return {
      cursos: rows.map((curso) =>
        toCursoCatalogo(curso, totalesPorCurso[Number(curso.id)] ?? 0)
      ),
      pagination: buildPagination({ page: filtros.page, limit: filtros.limit, total: count }),
    };
  },

  async listCategorias() {
    const categorias = await cursoRepository.findCategorias();

    return { categorias };
  },

  async getPublicDetail(cursoId) {
    const curso = await cursoRepository.findPublicById(cursoId);

    if (!curso) {
      throw new AppError('Curso no encontrado.', 404, 'COURSE_NOT_FOUND');
    }

    const data = toPlain(curso);
    const temario = (data.lecciones ?? []).map(toLeccionTemario);

    return {
      curso: {
        ...toCursoResumen(data),
        instructor: data.instructor
          ? { id: data.instructor.id, nombre: data.instructor.nombre }
          : null,
        totalLecciones: temario.length,
        temario,
      },
    };
  },

  async create(instructorId, data) {
    const curso = await cursoRepository.create({
      titulo: data.titulo,
      descripcion: data.descripcion,
      categoria: data.categoria,
      nivel: data.nivel,
      estado: 'borrador',
      instructorId,
    });

    return toCursoResumen(curso);
  },

  async update(curso, data) {
    const actualizado = await cursoRepository.updateById(curso.id, data);
    return toCursoResumen(actualizado);
  },

  async remove(curso) {
    const inscritos = await cursoRepository.countInscripciones(curso.id);

    if (inscritos > 0) {
      throw new AppError(
        'El curso tiene estudiantes inscritos; archívalo en lugar de eliminarlo.',
        409,
        'COURSE_HAS_ENROLLMENTS',
        { inscritos }
      );
    }

    await cursoRepository.deleteById(curso.id);
  },

  async changeEstado(curso, estado) {
    if (curso.estado === estado) {
      return toCursoResumen(curso);
    }

    if (estado === 'publicado') {
      const totalLecciones = await leccionRepository.countByCurso(curso.id);

      if (totalLecciones === 0) {
        throw new AppError(
          'No se puede publicar un curso sin al menos una lección.',
          422,
          'COURSE_WITHOUT_LESSONS'
        );
      }
    }

    const actualizado = await cursoRepository.updateById(curso.id, { estado });
    return toCursoResumen(actualizado);
  },

  async listMine(instructorId, paginacion) {
    const { rows, count } = await cursoRepository.findByInstructor(instructorId, paginacion);

    return {
      cursos: rows.map(toCursoInstructor),
      pagination: buildPagination({
        page: paginacion.page,
        limit: paginacion.limit,
        total: count,
      }),
    };
  },

  async getMine(curso) {
    const cursoCompleto = await cursoRepository.findWithLessons(curso.id);
    const lecciones = cursoCompleto?.lecciones ?? [];
    const preguntas = await preguntaRepository.findByLeccionIdsConRespuesta(
      lecciones.map((leccion) => leccion.id)
    );
    const preguntasPorLeccion = agruparPreguntasPorLeccion(preguntas);

    return {
      curso: {
        ...toCursoResumen(cursoCompleto),
        lecciones: lecciones.map((leccion) => ({
          ...toPlain(leccion),
          preguntas: preguntasPorLeccion.get(Number(leccion.id)) ?? [],
        })),
      },
    };
  },

  async getResumen(curso) {
    const [lecciones, inscripciones] = await Promise.all([
      leccionRepository.findByCurso(curso.id),
      inscripcionRepository.listByCursoWithProgresos(curso.id),
    ]);

    const totalLecciones = lecciones.length;
    const inscritos = inscripciones.length;

    const avances = inscripciones.map((inscripcion) => {
      const completadas = (inscripcion.progresos ?? []).filter((p) => p.completada).length;
      return totalLecciones === 0 ? 0 : (completadas / totalLecciones) * 100;
    });

    const progresoPromedio =
      inscritos === 0 ? 0 : Math.round(avances.reduce((total, avance) => total + avance, 0) / inscritos);

    const notas = inscripciones.flatMap((inscripcion) =>
      (inscripcion.progresos ?? [])
        .filter((progreso) => progreso.mejorNota !== null && progreso.mejorNota !== undefined)
        .map((progreso) => Number(progreso.mejorNota))
    );

    const notaPromedio =
      notas.length === 0
        ? null
        : Math.round((notas.reduce((total, nota) => total + nota, 0) / notas.length) * 100) / 100;

    // Para cada estudiante se identifica la primera lección que todavía no completó.
    const detenidosPorLeccion = new Map();

    for (const inscripcion of inscripciones) {
      const completadas = new Set(
        (inscripcion.progresos ?? [])
          .filter((progreso) => progreso.completada)
          .map((progreso) => Number(progreso.leccionId))
      );
      const primeraPendiente = lecciones.find((leccion) => !completadas.has(Number(leccion.id)));

      if (primeraPendiente) {
        const leccionId = Number(primeraPendiente.id);
        detenidosPorLeccion.set(leccionId, (detenidosPorLeccion.get(leccionId) ?? 0) + 1);
      }
    }

    let leccionDondeSeDetienen = null;

    for (const [leccionId, estudiantes] of detenidosPorLeccion.entries()) {
      if (!leccionDondeSeDetienen || estudiantes > leccionDondeSeDetienen.estudiantes) {
        const leccion = lecciones.find((item) => Number(item.id) === leccionId);
        leccionDondeSeDetienen = {
          id: leccion.id,
          titulo: leccion.titulo,
          orden: leccion.orden,
          estudiantes,
        };
      }
    }

    return {
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        estado: curso.estado,
      },
      inscritos,
      progresoPromedio,
      notaPromedio,
      leccionDondeSeDetienen,
      lecciones: lecciones.map((leccion) => ({
        id: leccion.id,
        titulo: leccion.titulo,
        tipo: leccion.tipo,
        orden: leccion.orden,
        estudiantesCompletaron: inscripciones.filter((inscripcion) =>
          (inscripcion.progresos ?? []).some(
            (progreso) => Number(progreso.leccionId) === Number(leccion.id) && progreso.completada
          )
        ).length,
        estudiantesDetenidos: detenidosPorLeccion.get(Number(leccion.id)) ?? 0,
      })),
    };
  },
};
