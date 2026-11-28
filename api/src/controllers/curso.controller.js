import { cursoService } from '../services/curso.service.js';

export const cursoController = {
  async list(req, res, next) {
    try {
      const result = await cursoService.listCatalog(req.validated.query);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async listCategorias(req, res, next) {
    try {
      const result = await cursoService.listCategorias();
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async getPublic(req, res, next) {
    try {
      const { curso } = await cursoService.getPublicDetail(req.validated.params.id);
      return res.status(200).json({ curso });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const curso = await cursoService.create(req.user.id, req.body);
      return res.status(201).json({ curso });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    try {
      const curso = await cursoService.update(req.curso, req.body);
      return res.status(200).json({ curso });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await cursoService.remove(req.curso);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  async changeEstado(req, res, next) {
    try {
      const curso = await cursoService.changeEstado(req.curso, req.body.estado);
      return res.status(200).json({ curso });
    } catch (error) {
      return next(error);
    }
  },

  async listMine(req, res, next) {
    try {
      const result = await cursoService.listMine(req.user.id, req.validated.query);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async getMine(req, res, next) {
    try {
      const { curso } = await cursoService.getMine(req.curso);
      return res.status(200).json({ curso });
    } catch (error) {
      return next(error);
    }
  },

  async getResumen(req, res, next) {
    try {
      const resumen = await cursoService.getResumen(req.curso);
      return res.status(200).json({ resumen });
    } catch (error) {
      return next(error);
    }
  },
};
