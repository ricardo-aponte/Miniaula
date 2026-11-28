import { Op } from 'sequelize';
import { Curso, Inscripcion, Leccion, Usuario } from '../db/models/index.js';
import { getOffset } from '../utils/pagination.js';

const INSTRUCTOR_ATTRIBUTES = ['id', 'nombre'];

export const cursoRepository = {
  async findPublished({ q, categoria, page, limit }) {
    const where = { estado: 'publicado' };

    if (categoria) {
      where.categoria = categoria;
    }

    if (q) {
      where.titulo = { [Op.iLike]: `%${q}%` };
    }

    const { rows, count } = await Curso.findAndCountAll({
      where,
      include: [{ model: Usuario, as: 'instructor', attributes: INSTRUCTOR_ATTRIBUTES }],
      order: [['creadoEn', 'DESC']],
      limit,
      offset: getOffset(page, limit),
      distinct: true,
    });

    return { rows, count };
  },

  async findCategorias() {
    const rows = await Curso.findAll({
      where: { estado: 'publicado' },
      attributes: ['categoria'],
      group: ['categoria'],
      order: [['categoria', 'ASC']],
      raw: true,
    });

    return rows.map((row) => row.categoria);
  },

  findPublicById(cursoId) {
    return Curso.findOne({
      where: { id: cursoId, estado: 'publicado' },
      include: [
        { model: Usuario, as: 'instructor', attributes: INSTRUCTOR_ATTRIBUTES },
        {
          model: Leccion,
          as: 'lecciones',
          attributes: ['id', 'titulo', 'tipo', 'orden', 'notaMinima'],
          separate: true,
          order: [
            ['orden', 'ASC'],
            ['id', 'ASC'],
          ],
        },
      ],
    });
  },

  findById(cursoId) {
    return Curso.findByPk(cursoId);
  },

  findOwnedById(cursoId, instructorId) {
    return Curso.findOne({ where: { id: cursoId, instructorId } });
  },

  async findByInstructor(instructorId, { page, limit }) {
    const where = { instructorId };

    const [rows, count] = await Promise.all([
      Curso.findAll({
        where,
        include: [
          { model: Leccion, as: 'lecciones', attributes: ['id'], separate: true },
          { model: Inscripcion, as: 'inscripciones', attributes: ['id'], separate: true },
        ],
        order: [['creadoEn', 'DESC']],
        limit,
        offset: getOffset(page, limit),
      }),
      Curso.count({ where }),
    ]);

    return { rows, count };
  },

  findWithLessons(cursoId) {
    return Curso.findByPk(cursoId, {
      include: [
        {
          model: Leccion,
          as: 'lecciones',
          separate: true,
          order: [
            ['orden', 'ASC'],
            ['id', 'ASC'],
          ],
        },
      ],
    });
  },

  create(data) {
    return Curso.create(data);
  },

  async updateById(cursoId, data) {
    await Curso.update(data, { where: { id: cursoId } });
    return Curso.findByPk(cursoId);
  },

  deleteById(cursoId) {
    return Curso.destroy({ where: { id: cursoId } });
  },

  countInscripciones(cursoId) {
    return Inscripcion.count({ where: { cursoId } });
  },

  countLecciones(cursoId) {
    return Leccion.count({ where: { cursoId } });
  },
};
