import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.use(authenticate);
router.get('/me', userController.getMe);
router.put('/me', validate({ body: updateProfileSchema }), userController.updateMe);

export default router;