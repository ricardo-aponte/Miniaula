import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  loginRateLimiter,
  passwordResetRateLimiter,
} from '../middlewares/rateLimit.middleware.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', loginRateLimiter, validate({ body: loginSchema }), authController.login);

router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  passwordResetRateLimiter,
  validate({ body: resetPasswordSchema }),
  authController.resetPassword
);

export default router;
