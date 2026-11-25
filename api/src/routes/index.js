import { Router } from 'express';
import authRoutes from './auth.routes.js';
import cursoRoutes from './curso.routes.js';
import inscripcionRoutes from './inscripcion.routes.js';
import instructorRoutes from './instructor.routes.js';
import leccionRoutes from './leccion.routes.js';
import preguntaRoutes from './pregunta.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MiniAula API activa' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cursos', cursoRoutes);
router.use('/instructor', instructorRoutes);
router.use('/lecciones', leccionRoutes);
router.use('/preguntas', preguntaRoutes);
router.use('/inscripciones', inscripcionRoutes);

export default router;
