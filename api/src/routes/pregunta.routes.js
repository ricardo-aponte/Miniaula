import { Router } from 'express';
import { preguntaController } from '../controllers/pregunta.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { requireQuestionOwner } from '../middlewares/ownership.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema } from '../validators/common.validator.js';
import { updatePreguntaSchema } from '../validators/pregunta.validator.js';

const router = Router();

router.use(authenticate, authorize('instructor'));

router.put(
  '/:id',
  validate({ params: idParamSchema, body: updatePreguntaSchema }),
  requireQuestionOwner('id'),
  preguntaController.update
);

router.delete(
  '/:id',
  validate({ params: idParamSchema }),
  requireQuestionOwner('id'),
  preguntaController.remove
);

export default router;
