import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
};