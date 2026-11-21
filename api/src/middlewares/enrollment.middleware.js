import { AppError } from '../errors/AppError.js';
import { resourceAuthRepository } from '../repositories/resourceAuth.repository.js';

function parseId(req, paramName = 'id') {
  const raw = req.validated?.params?.[paramName] ?? req.params[paramName];
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(`El parámetro "${paramName}" debe ser un número entero positivo.`, 400, 'INVALID_ID');
  }
  return id;
}

export function requireEnrolledInCourse(paramName = 'id') {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Usuario no autenticado.', 401, 'UNAUTHORIZED'));
      }

      const cursoId = parseId(req, paramName);
      const curso = await resourceAuthRepository.findCursoById(cursoId);

      if (!curso) {
        return next(new AppError('Curso no encontrado.', 404, 'COURSE_NOT_FOUND'));
      }

      const inscripcion = await resourceAuthRepository.findInscripcion(req.user.id, cursoId);

      if (!inscripcion) {
        return next(
          new AppError('Debes estar inscrito en este curso para acceder.', 403, 'NOT_ENROLLED')
        );
      }

      req.curso = curso;
      req.inscripcion = inscripcion;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireEnrolledByLesson(paramName = 'id') {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Usuario no autenticado.', 401, 'UNAUTHORIZED'));
      }

      const leccionId = parseId(req, paramName);
      const leccion = await resourceAuthRepository.findLeccionWithCurso(leccionId);

      if (!leccion || !leccion.curso) {
        return next(new AppError('Lección no encontrada.', 404, 'LESSON_NOT_FOUND'));
      }

      const inscripcion = await resourceAuthRepository.findInscripcion(req.user.id, leccion.cursoId);

      if (!inscripcion) {
        return next(
          new AppError('Debes estar inscrito en el curso para acceder a esta lección.', 403, 'NOT_ENROLLED')
        );
      }

      req.leccion = leccion;
      req.curso = leccion.curso;
      req.inscripcion = inscripcion;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}