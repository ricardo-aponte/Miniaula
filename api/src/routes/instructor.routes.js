import { Router } from 'express';
import { cursoController } from '../controllers/curso.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { requireCourseOwner } from '../middlewares/ownership.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema, paginationQuerySchema } from '../validators/common.validator.js';

const router = Router();

router.use(authenticate, authorize('instructor'));

router.get('/cursos', validate({ query: paginationQuerySchema }), cursoController.listMine);
router.get(
  '/cursos/:id',
  validate({ params: idParamSchema }),
  requireCourseOwner('id'),
  cursoController.getMine
);
router.get(
  '/cursos/:id/resumen',
  validate({ params: idParamSchema }),
  requireCourseOwner('id'),
  cursoController.getResumen
);

export default router;
