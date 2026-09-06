import { Router } from 'express';
import { currentUser, login, verifyLoginOtp } from '../business/authBusiness.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responses.js';
import { loginOtpSchema, loginSchema } from '../validation/authSchemas.js';

export const authRouter = Router();

authRouter.post('/login', authLimiter, validate(loginSchema), asyncHandler(async (request, response) => {
  const data = await login(request.body, request);
  sendSuccess(response, data, 'Login successful');
}));

authRouter.post('/login/otp', authLimiter, validate(loginOtpSchema), asyncHandler(async (request, response) => {
  const data = await verifyLoginOtp(request.body);
  sendSuccess(response, data, 'OTP verified');
}));

authRouter.get('/me', authenticate, (request, response) => {
  sendSuccess(response, currentUser(request.user));
});
