import { userService } from '../services/user.service.js';

export const userController = {
  async getMe(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  async updateMe(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },
};