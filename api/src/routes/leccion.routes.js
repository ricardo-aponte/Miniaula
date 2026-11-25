import { Router } from 'express';
import { leccionController } from '../controllers/leccion.controller.js';
import { preguntaController } from '../controllers/pregunta.controller.js';
import { progresoController } from '../controllers/progreso.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { requireEnrolledByLesson } from '../middlewares/enrollment.middleware.js';
import { requireLessonOwner } from '../middlewares/ownership.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema } from '../validators/common.validator.js';
import { updateLeccionSchema } from '../validators/leccion.validator.js';
import { createPreguntaSchema } from '../validators/pregunta.validator.js';
import { intentoCuestionarioSchema } from '../validators/progreso.validator.js';

const router = Router();

router.use(authenticate);

// Estudiante inscrito
router.get(
  '/:id',
  authorize('estudiante'),
  validate({ params: idParamSchema }),
  requireEnrolledByLesson('id'),
  progresoController.getLeccion
);

router.post(
  '/:id/completar',
  authorize('estudiante'),
  validate({ params: idParamSchema }),
  requireEnrolledByLesson('id'),
  progresoController.completarLeccion
);

router.post(
  '/:id/intentos',
  authorize('estudiante'),
  validate({ params: idParamSchema, body: intentoCuestionarioSchema }),
  requireEnrolledByLesson('id'),
  progresoController.rendirIntento
);

// Instructor dueño
router.put(
  '/:id',
  authorize('instructor'),
  validate({ params: idParamSchema, body: updateLeccionSchema }),
  requireLessonOwner('id'),
  leccionController.update
);

router.delete(
  '/:id',
  authorize('instructor'),
  validate({ params: idParamSchema }),
  requireLessonOwner('id'),
  leccionController.remove
);

router.post(
  '/:id/preguntas',
  authorize('instructor'),
  validate({ params: idParamSchema, body: createPreguntaSchema }),
  requireLessonOwner('id'),
  preguntaController.create
);

export default router;
