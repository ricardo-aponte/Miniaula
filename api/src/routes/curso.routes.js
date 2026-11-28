import { Router } from 'express';
import { cursoController } from '../controllers/curso.controller.js';
import { inscripcionController } from '../controllers/inscripcion.controller.js';
import { leccionController } from '../controllers/leccion.controller.js';
import { progresoController } from '../controllers/progreso.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { requireEnrolledInCourse } from '../middlewares/enrollment.middleware.js';
import { requireCourseOwner } from '../middlewares/ownership.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema } from '../validators/common.validator.js';
import {
  catalogQuerySchema,
  createCursoSchema,
  estadoCursoSchema,
  updateCursoSchema,
} from '../validators/curso.validator.js';
import { createLeccionSchema, reorderLeccionesSchema } from '../validators/leccion.validator.js';

const router = Router();

// Catálogo público
router.get('/', validate({ query: catalogQuerySchema }), cursoController.list);
// Debe declararse antes de /:id para que no se interprete como un id.
router.get('/categorias', cursoController.listCategorias);
router.get('/:id', validate({ params: idParamSchema }), cursoController.getPublic);

// Cursos gestionados por el instructor dueño
router.post(
  '/',
  authenticate,
  authorize('instructor'),
  validate({ body: createCursoSchema }),
  cursoController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('instructor'),
  validate({ params: idParamSchema, body: updateCursoSchema }),
  requireCourseOwner('id'),
  cursoController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('instructor'),
  validate({ params: idParamSchema }),
  requireCourseOwner('id'),
  cursoController.remove
);

router.patch(
  '/:id/estado',
  authenticate,
  authorize('instructor'),
  validate({ params: idParamSchema, body: estadoCursoSchema }),
  requireCourseOwner('id'),
  cursoController.changeEstado
);

// Lecciones del curso
router.post(
  '/:id/lecciones',
  authenticate,
  authorize('instructor'),
  validate({ params: idParamSchema, body: createLeccionSchema }),
  requireCourseOwner('id'),
  leccionController.create
);

router.patch(
  '/:id/lecciones/orden',
  authenticate,
  authorize('instructor'),
  validate({ params: idParamSchema, body: reorderLeccionesSchema }),
  requireCourseOwner('id'),
  leccionController.reorder
);

// Inscripción y progreso del estudiante
router.post(
  '/:id/inscripcion',
  authenticate,
  authorize('estudiante'),
  validate({ params: idParamSchema }),
  inscripcionController.enroll
);

router.get(
  '/:id/progreso',
  authenticate,
  authorize('estudiante'),
  validate({ params: idParamSchema }),
  requireEnrolledInCourse('id'),
  progresoController.getCursoProgreso
);

export default router;
