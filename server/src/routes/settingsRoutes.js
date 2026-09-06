import { Router } from 'express';
import * as settingsBusiness from '../business/settingsBusiness.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responses.js';
import { themeSchema } from '../validation/settingsSchemas.js';

export const settingsRouter = Router();

settingsRouter.get('/theme', asyncHandler(async (request, response) => {
  const theme = await settingsBusiness.getTheme(request);
  sendSuccess(response, theme);
}));

settingsRouter.put('/theme', authenticate, authorize('super_admin', 'owner', 'admin'), validate(themeSchema), asyncHandler(async (request, response) => {
  const theme = await settingsBusiness.saveTheme(request.body, request.user, request);
  sendSuccess(response, theme, 'Theme saved');
}));
