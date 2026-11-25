import { preguntaService } from '../services/pregunta.service.js';

export const preguntaController = {
  async create(req, res, next) {
    try {
      const pregunta = await preguntaService.create(req.leccion, req.body);
      return res.status(201).json({ pregunta });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const pregunta = await preguntaService.update(req.pregunta, req.body);
      return res.status(200).json({ pregunta });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await preguntaService.remove(req.pregunta);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
};
