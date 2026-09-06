import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export function validate(schema) {
  return (request, _response, next) => {
    try {
      const parsed = schema.parse({
        body: request.body,
        params: request.params,
        query: request.query,
      });

      request.body = parsed.body ?? request.body;
      request.params = parsed.params ?? request.params;
      request.query = parsed.query ?? request.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(400, 'Validation failed', error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }))));
        return;
      }
      next(error);
    }
  };
}
