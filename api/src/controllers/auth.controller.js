import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.validated.body);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.validated.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const result = await authService.forgotPassword(req.validated.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const result = await authService.resetPassword(req.validated.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
};
