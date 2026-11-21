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

export function requireCourseOwner(paramName = 'id') {
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

      if (curso.instructorId !== req.user.id) {
        return next(
          new AppError('No tienes permisos para modificar un curso que no te pertenece.', 403, 'NOT_COURSE_OWNER')
        );
      }

      req.curso = curso;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireLessonOwner(paramName = 'id') {
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

      if (leccion.curso.instructorId !== req.user.id) {
        return next(
          new AppError('No tienes permisos para modificar lecciones de un curso que no te pertenece.', 403, 'NOT_COURSE_OWNER')
        );
      }

      req.leccion = leccion;
      req.curso = leccion.curso;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireQuestionOwner(paramName = 'id') {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Usuario no autenticado.', 401, 'UNAUTHORIZED'));
      }

      const preguntaId = parseId(req, paramName);
      const pregunta = await resourceAuthRepository.findPreguntaWithCurso(preguntaId);

      if (!pregunta || !pregunta.leccion?.curso) {
        return next(new AppError('Pregunta no encontrada.', 404, 'QUESTION_NOT_FOUND'));
      }

      if (pregunta.leccion.curso.instructorId !== req.user.id) {
        return next(
          new AppError('No tienes permisos para modificar preguntas de un curso que no te pertenece.', 403, 'NOT_COURSE_OWNER')
        );
      }

      req.pregunta = pregunta;
      req.leccion = pregunta.leccion;
      req.curso = pregunta.leccion.curso;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}