import { AppError } from '../errors/AppError.js';

export function validate(schemas = {}) {
  return (req, res, next) => {
    const errors = [];
    req.validated = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    for (const part of ['params', 'query', 'body']) {
      if (!schemas[part]) continue;

      const result = schemas[part].safeParse(req[part]);

      if (!result.success) {
        const formatted = result.error.issues.map((issue) => ({
          source: part,
          field: issue.path.join('.'),
          message: issue.message,
        }));
        errors.push(...formatted);
      } else {
        req.validated[part] = result.data;
        if (part === 'body') {
          req.body = result.data;
        }
      }
    }

    if (errors.length > 0) {
      return next(
        new AppError(
          'Los datos enviados no son válidos.',
          400,
          'VALIDATION_ERROR',
          errors
        )
      );
    }

    return next();
  };
}