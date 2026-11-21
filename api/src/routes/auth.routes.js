import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginRateLimiter } from '../middlewares/rateLimit.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', loginRateLimiter, validate({ body: loginSchema }), authController.login);

export default router;