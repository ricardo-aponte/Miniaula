import { progresoService } from '../services/progreso.service.js';

export const progresoController = {
  async getLeccion(req, res, next) {
    try {
      const result = await progresoService.getLeccion(req.leccion, req.curso, req.inscripcion);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async completarLeccion(req, res, next) {
    try {
      const result = await progresoService.completarLeccion(
        req.leccion,
        req.curso,
        req.inscripcion
      );
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async rendirIntento(req, res, next) {
    try {
      const result = await progresoService.rendirIntento(
        req.leccion,
        req.curso,
        req.inscripcion,
        req.body.respuestas
      );
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async getCursoProgreso(req, res, next) {
    try {
      const result = await progresoService.getCursoProgreso(req.curso, req.inscripcion);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
};
