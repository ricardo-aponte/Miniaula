import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MiniAula API activa' });
});

// Aquí iran las rutas de cada módulo:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/cursos', cursoRoutes);
// ...

export default router;