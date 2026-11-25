'use strict';

const { QueryTypes } = require('sequelize');

const INSCRIPCIONES = [
  { estudianteEmail: 'juan@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', fecha: '2026-11-01T10:00:00Z' },
  { estudianteEmail: 'juan@miniaula.com', cursoTitulo: 'Bases de Datos Relacionales', fecha: '2026-11-02T10:00:00Z' },
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', fecha: '2026-11-03T10:00:00Z' },
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Diseño de Experiencia de Usuario', fecha: '2026-11-04T10:00:00Z' },
  { estudianteEmail: 'pedro@miniaula.com', cursoTitulo: 'Bases de Datos Relacionales', fecha: '2026-11-05T10:00:00Z' },
  { estudianteEmail: 'pedro@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', fecha: '2026-11-06T10:00:00Z' },
];

const PROGRESOS = [
  // Juan (curso web): completó la primera lección.
  { estudianteEmail: 'juan@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', leccionOrden: 1 },
  // María (curso web): completó las 4 lecciones de contenido, el cuestionario queda desbloqueado.
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', leccionOrden: 1 },
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', leccionOrden: 2 },
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', leccionOrden: 3 },
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', leccionOrden: 4 },
  // María (curso ux).
  { estudianteEmail: 'maria@miniaula.com', cursoTitulo: 'Diseño de Experiencia de Usuario', leccionOrden: 1 },
  // Pedro (curso datos).
  { estudianteEmail: 'pedro@miniaula.com', cursoTitulo: 'Bases de Datos Relacionales', leccionOrden: 1 },
  // Pedro (curso web).
  { estudianteEmail: 'pedro@miniaula.com', cursoTitulo: 'Fundamentos de Desarrollo Web', leccionOrden: 1 },
];

const claveInscripcion = (email, cursoTitulo) => `${email}|${cursoTitulo}`;

async function buscarIdsPorEmail(queryInterface, emails) {
  const filas = await queryInterface.sequelize.query(
    'SELECT id, email FROM usuarios WHERE email IN (:emails);',
    { replacements: { emails }, type: QueryTypes.SELECT }
  );

  return new Map(filas.map((fila) => [fila.email, fila.id]));
}

async function buscarIdsPorTitulo(queryInterface, titulos) {
  const filas = await queryInterface.sequelize.query(
    'SELECT id, titulo FROM cursos WHERE titulo IN (:titulos);',
    { replacements: { titulos }, type: QueryTypes.SELECT }
  );

  return new Map(filas.map((fila) => [fila.titulo, fila.id]));
}

module.exports = {
  async up(queryInterface) {
    const actualizadoEn = new Date();
    const emails = [...new Set(INSCRIPCIONES.map((inscripcion) => inscripcion.estudianteEmail))];
    const titulos = [...new Set(INSCRIPCIONES.map((inscripcion) => inscripcion.cursoTitulo))];

    const estudiantes = await buscarIdsPorEmail(queryInterface, emails);
    const cursos = await buscarIdsPorTitulo(queryInterface, titulos);

    const inscripcionesIds = new Map();

    for (const inscripcion of INSCRIPCIONES) {
      const estudianteId = estudiantes.get(inscripcion.estudianteEmail);
      const cursoId = cursos.get(inscripcion.cursoTitulo);

      if (!estudianteId || !cursoId) {
        throw new Error(
          `Faltan datos para inscribir a ${inscripcion.estudianteEmail} en "${inscripcion.cursoTitulo}".`
        );
      }

      const existente = await queryInterface.sequelize.query(
        'SELECT id FROM inscripciones WHERE estudiante_id = :estudianteId AND curso_id = :cursoId LIMIT 1;',
        { replacements: { estudianteId, cursoId }, type: QueryTypes.SELECT }
      );

      if (existente.length > 0) {
        inscripcionesIds.set(claveInscripcion(inscripcion.estudianteEmail, inscripcion.cursoTitulo), existente[0].id);
        continue;
      }

      const [insertada] = await queryInterface.sequelize.query(
        `INSERT INTO inscripciones (estudiante_id, curso_id, fecha_inscripcion, completado)
         VALUES (:estudianteId, :cursoId, :fecha, false)
         RETURNING id;`,
        {
          replacements: {
            estudianteId,
            cursoId,
            fecha: new Date(inscripcion.fecha),
          },
          type: QueryTypes.SELECT,
        }
      );

      inscripcionesIds.set(claveInscripcion(inscripcion.estudianteEmail, inscripcion.cursoTitulo), insertada.id);
    }

    for (const progreso of PROGRESOS) {
      const inscripcionId = inscripcionesIds.get(
        claveInscripcion(progreso.estudianteEmail, progreso.cursoTitulo)
      );
      const cursoId = cursos.get(progreso.cursoTitulo);

      const [leccion] = await queryInterface.sequelize.query(
        'SELECT id FROM lecciones WHERE curso_id = :cursoId AND orden = :orden LIMIT 1;',
        {
          replacements: { cursoId, orden: progreso.leccionOrden },
          type: QueryTypes.SELECT,
        }
      );

      if (!inscripcionId || !leccion) {
        throw new Error(
          `Faltan datos para registrar el progreso de ${progreso.estudianteEmail} en "${progreso.cursoTitulo}".`
        );
      }

      const existente = await queryInterface.sequelize.query(
        'SELECT id FROM progresos WHERE inscripcion_id = :inscripcionId AND leccion_id = :leccionId LIMIT 1;',
        { replacements: { inscripcionId, leccionId: leccion.id }, type: QueryTypes.SELECT }
      );

      if (existente.length > 0) {
        continue;
      }

      await queryInterface.sequelize.query(
        `INSERT INTO progresos (inscripcion_id, leccion_id, completada, intentos, mejor_nota, actualizado_en)
         VALUES (:inscripcionId, :leccionId, true, 0, NULL, :actualizadoEn);`,
        {
          replacements: {
            inscripcionId,
            leccionId: leccion.id,
            actualizadoEn,
          },
        }
      );
    }

    for (const tabla of ['inscripciones', 'progresos']) {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('${tabla}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM ${tabla}), 1));`
      );
    }
  },

  async down(queryInterface) {
    const emails = [...new Set(INSCRIPCIONES.map((inscripcion) => inscripcion.estudianteEmail))];
    const titulos = [...new Set(INSCRIPCIONES.map((inscripcion) => inscripcion.cursoTitulo))];

    const estudiantes = await buscarIdsPorEmail(queryInterface, emails);
    const cursos = await buscarIdsPorTitulo(queryInterface, titulos);

    const estudiantesIds = [...estudiantes.values()];
    const cursosIds = [...cursos.values()];

    if (estudiantesIds.length === 0 || cursosIds.length === 0) {
      return;
    }

    const inscripciones = await queryInterface.sequelize.query(
      'SELECT id FROM inscripciones WHERE estudiante_id IN (:estudiantesIds) AND curso_id IN (:cursosIds);',
      { replacements: { estudiantesIds, cursosIds }, type: QueryTypes.SELECT }
    );
    const inscripcionesIds = inscripciones.map((inscripcion) => inscripcion.id);

    if (inscripcionesIds.length === 0) {
      return;
    }

    await queryInterface.sequelize.query(
      'DELETE FROM progresos WHERE inscripcion_id IN (:inscripcionesIds);',
      { replacements: { inscripcionesIds } }
    );
    await queryInterface.sequelize.query(
      'DELETE FROM inscripciones WHERE id IN (:inscripcionesIds);',
      { replacements: { inscripcionesIds } }
    );
  },
};
