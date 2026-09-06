import { isProduction } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFound(request, _response, next) {
  next(new ApiError(404, `Route not found: ${request.method} ${request.originalUrl}`));
}

export function errorHandler(error, _request, response, _next) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  if (!isProduction && statusCode === 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message,
    errors: error instanceof ApiError ? error.errors : [],
  });
}
