import { inscripcionService } from '../services/inscripcion.service.js';

export const inscripcionController = {
  async enroll(req, res, next) {
    try {
      const result = await inscripcionService.enroll(req.validated.params.id, req.user.id);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async listMine(req, res, next) {
    try {
      const result = await inscripcionService.listMias(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
};
