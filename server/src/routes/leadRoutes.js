import { Router } from 'express';
import * as leadBusiness from '../business/leadBusiness.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { leadLimiter } from '../middleware/rateLimiters.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responses.js';
import { leadAssignSchema, leadCreateSchema, leadParamsSchema, leadStatusSchema, leadUpdateSchema } from '../validation/leadSchemas.js';

export const leadRouter = Router();

leadRouter.post('/', leadLimiter, validate(leadCreateSchema), asyncHandler(async (request, response) => {
  const lead = await leadBusiness.createLead(request.body, request);
  response.status(201).json(lead);
}));

leadRouter.get('/', authenticate, authorize('admin', 'owner'), asyncHandler(async (request, response) => {
  const leads = await leadBusiness.listLeads(request);
  response.json(leads);
}));

leadRouter.get('/:id', authenticate, authorize('admin', 'owner'), validate(leadParamsSchema), asyncHandler(async (request, response) => {
  const lead = await leadBusiness.getLead(request.params.id, request);
  response.json(lead);
}));

leadRouter.patch('/:id/status', authenticate, authorize('admin', 'owner'), validate(leadStatusSchema), asyncHandler(async (request, response) => {
  const lead = await leadBusiness.updateStatus(request.params.id, request.body.status, request);
  response.json(lead);
}));

leadRouter.patch('/:id', authenticate, authorize('admin', 'owner'), validate(leadUpdateSchema), asyncHandler(async (request, response) => {
  const lead = await leadBusiness.updateLead(request.params.id, request.body, request);
  sendSuccess(response, lead, 'Lead updated');
}));

leadRouter.patch('/:id/assign', authenticate, authorize('admin', 'owner'), validate(leadAssignSchema), asyncHandler(async (request, response) => {
  const lead = await leadBusiness.assignLead(request.params.id, request.body.assignedTo, request);
  response.json(lead);
}));

leadRouter.delete('/:id', authenticate, authorize('admin', 'owner'), validate(leadParamsSchema), asyncHandler(async (request, response) => {
  const lead = await leadBusiness.archiveLead(request.params.id, request);
  sendSuccess(response, lead, 'Lead archived');
}));
