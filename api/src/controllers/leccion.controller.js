import { leccionService } from '../services/leccion.service.js';

export const leccionController = {
  async create(req, res, next) {
    try {
      const leccion = await leccionService.create(req.curso, req.body);
      return res.status(201).json({ leccion });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const leccion = await leccionService.update(req.leccion, req.body);
      return res.status(200).json({ leccion });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await leccionService.remove(req.leccion, req.curso);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  async reorder(req, res, next) {
    try {
      const result = await leccionService.reorder(req.curso, req.body.orden);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
};
