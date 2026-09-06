import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function authenticate(request, _response, next) {
  const header = request.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    next(new ApiError(401, 'Authentication required'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    request.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (_error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

export function authorize(...allowedRoles) {
  return (request, _response, next) => {
    if (!request.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }

    if (request.user.role !== 'super_admin' && !allowedRoles.includes(request.user.role)) {
      next(new ApiError(403, 'Insufficient permissions'));
      return;
    }

    next();
  };
}
