import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MiniAula API activa' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;