import { Router } from 'express';
import { inscripcionController } from '../controllers/inscripcion.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('estudiante'));

router.get('/mias', inscripcionController.listMine);

export default router;
