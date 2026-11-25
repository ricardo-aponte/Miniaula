'use strict';

const { QueryTypes } = require('sequelize');

const CURSOS = [
  {
    clave: 'web',
    titulo: 'Fundamentos de Desarrollo Web',
    descripcion:
      'Aprende cómo funciona la web y construye tus primeras páginas con HTML, CSS y JavaScript.',
    categoria: 'Programación',
    nivel: 'principiante',
    estado: 'publicado',
    instructorEmail: 'ana@miniaula.com',
  },
  {
    clave: 'datos',
    titulo: 'Bases de Datos Relacionales',
    descripcion:
      'Modela, consulta y optimiza bases de datos relacionales con PostgreSQL y SQL.',
    categoria: 'Bases de Datos',
    nivel: 'intermedio',
    estado: 'publicado',
    instructorEmail: 'ana@miniaula.com',
  },
  {
    clave: 'ux',
    titulo: 'Diseño de Experiencia de Usuario',
    descripcion:
      'Investiga, prototipa y valida experiencias digitales centradas en las personas.',
    categoria: 'Diseño',
    nivel: 'principiante',
    estado: 'publicado',
    instructorEmail: 'carlos@miniaula.com',
  },
];

const LECCIONES = [
  // Curso web
  {
    cursoClave: 'web',
    titulo: '¿Cómo funciona la web?',
    tipo: 'contenido',
    contenido:
      'La web se basa en clientes que solicitan recursos y servidores que los entregan mediante HTTP.',
    video_url: 'https://www.youtube.com/watch?v=7_LPdttKXPc',
    orden: 1,
    nota_minima: null,
  },
  {
    cursoClave: 'web',
    titulo: 'HTML semántico',
    tipo: 'contenido',
    contenido:
      'Las etiquetas semánticas describen el significado del contenido y mejoran la accesibilidad.',
    video_url: 'https://www.youtube.com/watch?v=kX3nB4PpJko',
    orden: 2,
    nota_minima: null,
  },
  {
    cursoClave: 'web',
    titulo: 'CSS y diseño responsivo',
    tipo: 'contenido',
    contenido:
      'Con CSS controlamos la presentación y con media queries adaptamos el diseño a cada pantalla.',
    video_url: null,
    orden: 3,
    nota_minima: null,
  },
  {
    cursoClave: 'web',
    titulo: 'JavaScript esencial',
    tipo: 'contenido',
    contenido:
      'JavaScript agrega comportamiento: variables, funciones, eventos y manipulación del DOM.',
    video_url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    orden: 4,
    nota_minima: null,
  },
  {
    cursoClave: 'web',
    titulo: 'Cuestionario: fundamentos web',
    tipo: 'cuestionario',
    contenido: null,
    video_url: null,
    orden: 5,
    nota_minima: 60,
  },
  // Curso datos
  {
    cursoClave: 'datos',
    titulo: 'Introducción a los datos',
    tipo: 'contenido',
    contenido:
      'Un dato es un hecho registrado; la información surge cuando los datos se organizan y contextualizan.',
    video_url: null,
    orden: 1,
    nota_minima: null,
  },
  {
    cursoClave: 'datos',
    titulo: 'Modelo relacional',
    tipo: 'contenido',
    contenido:
      'El modelo relacional organiza la información en tablas con filas, columnas y claves.',
    video_url: 'https://www.youtube.com/watch?v=OqjJjpjDRLc',
    orden: 2,
    nota_minima: null,
  },
  {
    cursoClave: 'datos',
    titulo: 'SQL básico',
    tipo: 'contenido',
    contenido:
      'SELECT, INSERT, UPDATE y DELETE son las operaciones fundamentales sobre los datos.',
    video_url: null,
    orden: 3,
    nota_minima: null,
  },
  {
    cursoClave: 'datos',
    titulo: 'Cuestionario: SQL',
    tipo: 'cuestionario',
    contenido: null,
    video_url: null,
    orden: 4,
    nota_minima: 70,
  },
  {
    cursoClave: 'datos',
    titulo: 'Índices y rendimiento',
    tipo: 'contenido',
    contenido:
      'Los índices aceleran las búsquedas a costa de escrituras más lentas y mayor uso de disco.',
    video_url: null,
    orden: 5,
    nota_minima: null,
  },
  // Curso ux
  {
    cursoClave: 'ux',
    titulo: 'Principios de UX',
    tipo: 'contenido',
    contenido:
      'La experiencia de usuario considera utilidad, usabilidad, accesibilidad y deseabilidad.',
    video_url: null,
    orden: 1,
    nota_minima: null,
  },
  {
    cursoClave: 'ux',
    titulo: 'Investigación con usuarios',
    tipo: 'contenido',
    contenido:
      'Entrevistas, encuestas y pruebas observacionales ayudan a comprender necesidades reales.',
    video_url: null,
    orden: 2,
    nota_minima: null,
  },
  {
    cursoClave: 'ux',
    titulo: 'Wireframes y prototipos',
    tipo: 'contenido',
    contenido:
      'Un wireframe define estructura y jerarquía; un prototipo permite validar interacciones.',
    video_url: null,
    orden: 3,
    nota_minima: null,
  },
  {
    cursoClave: 'ux',
    titulo: 'Cuestionario: UX',
    tipo: 'cuestionario',
    contenido: null,
    video_url: null,
    orden: 4,
    nota_minima: 60,
  },
  {
    cursoClave: 'ux',
    titulo: 'Pruebas de usabilidad',
    tipo: 'contenido',
    contenido:
      'Observar a personas reales usar el producto revela fricciones que las métricas no muestran.',
    video_url: null,
    orden: 5,
    nota_minima: null,
  },
];

const PREGUNTAS = [
  {
    cursoClave: 'web',
    leccionOrden: 5,
    enunciado: '¿Qué significa HTML?',
    opciones: [
      'HyperText Markup Language',
      'High Tech Modern Language',
      'Hyper Transfer Machine Language',
      'Home Tool Markup Language',
    ],
    indice_correcto: 0,
  },
  {
    cursoClave: 'web',
    leccionOrden: 5,
    enunciado: '¿Qué etiqueta se usa para el contenido principal de una página?',
    opciones: ['<div>', '<main>', '<span>'],
    indice_correcto: 1,
  },
  {
    cursoClave: 'web',
    leccionOrden: 5,
    enunciado: '¿Qué propiedad de CSS permite adaptar el diseño a distintos tamaños?',
    opciones: ['font-family', 'display', 'media query', 'z-index'],
    indice_correcto: 2,
  },
  {
    cursoClave: 'datos',
    leccionOrden: 4,
    enunciado: '¿Qué cláusula de SQL filtra filas?',
    opciones: ['WHERE', 'ORDER BY', 'GROUP BY'],
    indice_correcto: 0,
  },
  {
    cursoClave: 'datos',
    leccionOrden: 4,
    enunciado: '¿Qué tipo de clave identifica de forma única cada fila?',
    opciones: ['Clave foránea', 'Clave primaria', 'Índice de texto'],
    indice_correcto: 1,
  },
  {
    cursoClave: 'ux',
    leccionOrden: 4,
    enunciado: '¿Cuál es un objetivo central de la investigación con usuarios?',
    opciones: [
      'Aumentar el número de líneas de código',
      'Comprender necesidades y comportamientos reales',
      'Elegir el color favorito del equipo',
    ],
    indice_correcto: 1,
  },
  {
    cursoClave: 'ux',
    leccionOrden: 4,
    enunciado: '¿Para qué sirve un prototipo?',
    opciones: [
      'Validar interacciones antes de construir el producto final',
      'Reemplazar las pruebas de usabilidad',
      'Documentar únicamente el código fuente',
    ],
    indice_correcto: 0,
  },
];

const claveLeccion = (cursoClave, orden) => `${cursoClave}:${orden}`;

async function buscarIdsPorEmail(queryInterface, emails) {
  const filas = await queryInterface.sequelize.query(
    'SELECT id, email FROM usuarios WHERE email IN (:emails);',
    { replacements: { emails }, type: QueryTypes.SELECT }
  );

  return new Map(filas.map((fila) => [fila.email, fila.id]));
}

module.exports = {
  async up(queryInterface) {
    const creadoEn = new Date();
    const instructores = await buscarIdsPorEmail(
      queryInterface,
      CURSOS.map((curso) => curso.instructorEmail)
    );

    const cursosIds = new Map();

    for (const curso of CURSOS) {
      const instructorId = instructores.get(curso.instructorEmail);

      if (!instructorId) {
        throw new Error(
          `Falta el usuario ${curso.instructorEmail}; ejecuta primero el seeder de usuarios.`
        );
      }

      const existente = await queryInterface.sequelize.query(
        'SELECT id FROM cursos WHERE titulo = :titulo LIMIT 1;',
        { replacements: { titulo: curso.titulo }, type: QueryTypes.SELECT }
      );

      if (existente.length > 0) {
        cursosIds.set(curso.clave, existente[0].id);
        continue;
      }

      const [insertado] = await queryInterface.sequelize.query(
        `INSERT INTO cursos (titulo, descripcion, categoria, nivel, estado, instructor_id, creado_en)
         VALUES (:titulo, :descripcion, :categoria, :nivel, :estado, :instructorId, :creadoEn)
         RETURNING id;`,
        {
          replacements: {
            titulo: curso.titulo,
            descripcion: curso.descripcion,
            categoria: curso.categoria,
            nivel: curso.nivel,
            estado: curso.estado,
            instructorId,
            creadoEn,
          },
          type: QueryTypes.SELECT,
        }
      );

      cursosIds.set(curso.clave, insertado.id);
    }

    const leccionesIds = new Map();

    for (const leccion of LECCIONES) {
      const cursoId = cursosIds.get(leccion.cursoClave);
      const existente = await queryInterface.sequelize.query(
        'SELECT id FROM lecciones WHERE curso_id = :cursoId AND orden = :orden LIMIT 1;',
        { replacements: { cursoId, orden: leccion.orden }, type: QueryTypes.SELECT }
      );

      if (existente.length > 0) {
        leccionesIds.set(claveLeccion(leccion.cursoClave, leccion.orden), existente[0].id);
        continue;
      }

      const [insertada] = await queryInterface.sequelize.query(
        `INSERT INTO lecciones (titulo, tipo, contenido, video_url, orden, nota_minima, curso_id)
         VALUES (:titulo, :tipo, :contenido, :videoUrl, :orden, :notaMinima, :cursoId)
         RETURNING id;`,
        {
          replacements: {
            titulo: leccion.titulo,
            tipo: leccion.tipo,
            contenido: leccion.contenido,
            videoUrl: leccion.video_url,
            orden: leccion.orden,
            notaMinima: leccion.nota_minima,
            cursoId,
          },
          type: QueryTypes.SELECT,
        }
      );

      leccionesIds.set(claveLeccion(leccion.cursoClave, leccion.orden), insertada.id);
    }

    for (const pregunta of PREGUNTAS) {
      const leccionId = leccionesIds.get(claveLeccion(pregunta.cursoClave, pregunta.leccionOrden));
      const existente = await queryInterface.sequelize.query(
        'SELECT id FROM preguntas WHERE leccion_id = :leccionId AND enunciado = :enunciado LIMIT 1;',
        { replacements: { leccionId, enunciado: pregunta.enunciado }, type: QueryTypes.SELECT }
      );

      if (existente.length > 0) {
        continue;
      }

      await queryInterface.sequelize.query(
        `INSERT INTO preguntas (enunciado, opciones, indice_correcto, leccion_id)
         VALUES (:enunciado, CAST(:opciones AS JSONB), :indiceCorrecto, :leccionId);`,
        {
          replacements: {
            enunciado: pregunta.enunciado,
            opciones: JSON.stringify(pregunta.opciones),
            indiceCorrecto: pregunta.indice_correcto,
            leccionId,
          },
        }
      );
    }

    for (const tabla of ['cursos', 'lecciones', 'preguntas']) {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('${tabla}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM ${tabla}), 1));`
      );
    }
  },

  async down(queryInterface) {
    const titulos = CURSOS.map((curso) => curso.titulo);

    const cursos = await queryInterface.sequelize.query(
      'SELECT id FROM cursos WHERE titulo IN (:titulos);',
      { replacements: { titulos }, type: QueryTypes.SELECT }
    );
    const cursosIds = cursos.map((curso) => curso.id);

    if (cursosIds.length === 0) {
      return;
    }

    const lecciones = await queryInterface.sequelize.query(
      'SELECT id FROM lecciones WHERE curso_id IN (:cursosIds);',
      { replacements: { cursosIds }, type: QueryTypes.SELECT }
    );
    const leccionesIds = lecciones.map((leccion) => leccion.id);

    if (leccionesIds.length > 0) {
      await queryInterface.sequelize.query(
        'DELETE FROM preguntas WHERE leccion_id IN (:leccionesIds);',
        { replacements: { leccionesIds } }
      );
    }

    await queryInterface.sequelize.query(
      'DELETE FROM lecciones WHERE curso_id IN (:cursosIds);',
      { replacements: { cursosIds } }
    );
    await queryInterface.sequelize.query(
      'DELETE FROM cursos WHERE id IN (:cursosIds);',
      { replacements: { cursosIds } }
    );
  },
};
