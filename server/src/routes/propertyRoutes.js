import { Router } from 'express';
import * as propertyBusiness from '../business/propertyBusiness.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responses.js';
import {
  imageCreateSchema,
  imageOrderSchema,
  imageParamsSchema,
  propertyCreateSchema,
  propertyParamsSchema,
  propertyQuerySchema,
  propertyStatusSchema,
  propertyUpdateSchema,
} from '../validation/propertySchemas.js';

export const propertyRouter = Router();

propertyRouter.get('/', validate(propertyQuerySchema), asyncHandler(async (request, response) => {
  const properties = await propertyBusiness.listProperties(request.query, request);
  response.json(properties);
}));

propertyRouter.get('/:id', validate(propertyParamsSchema), asyncHandler(async (request, response) => {
  const property = await propertyBusiness.getProperty(request.params.id, request);
  response.json(property);
}));

propertyRouter.post('/', authenticate, authorize('admin', 'owner'), validate(propertyCreateSchema), asyncHandler(async (request, response) => {
  const property = await propertyBusiness.createProperty(request.body, request.user, request);
  response.status(201).json(property);
}));

propertyRouter.put('/:id', authenticate, authorize('admin', 'owner'), validate(propertyUpdateSchema), asyncHandler(async (request, response) => {
  const property = await propertyBusiness.updateProperty(request.params.id, request.body, request);
  response.json(property);
}));

propertyRouter.patch('/:id/status', authenticate, authorize('admin', 'owner'), validate(propertyStatusSchema), asyncHandler(async (request, response) => {
  const property = await propertyBusiness.updateStatus(request.params.id, request.body.status, request);
  response.json(property);
}));

propertyRouter.delete('/:id', authenticate, authorize('admin', 'owner'), validate(propertyParamsSchema), asyncHandler(async (request, response) => {
  const property = await propertyBusiness.deactivateProperty(request.params.id, request);
  response.json(property);
}));

propertyRouter.get('/:propertyId/images', validate(imageParamsSchema), asyncHandler(async (request, response) => {
  const images = await propertyBusiness.listImages(request.params.propertyId, request);
  sendSuccess(response, images);
}));

propertyRouter.post('/:propertyId/images', authenticate, authorize('admin', 'owner'), validate(imageCreateSchema), asyncHandler(async (request, response) => {
  const image = await propertyBusiness.addImage(request.params.propertyId, request.body, request);
  sendSuccess(response, image, 'Image metadata added', 201);
}));

propertyRouter.patch('/:propertyId/images/order', authenticate, authorize('admin', 'owner'), validate(imageOrderSchema), asyncHandler(async (request, response) => {
  const images = await propertyBusiness.updateImageOrder(request.params.propertyId, request.body.images, request);
  sendSuccess(response, images, 'Image order updated');
}));

propertyRouter.patch('/:propertyId/images/:imageId/primary', authenticate, authorize('admin', 'owner'), validate(imageParamsSchema), asyncHandler(async (request, response) => {
  const image = await propertyBusiness.setPrimaryImage(request.params.propertyId, request.params.imageId, request);
  sendSuccess(response, image, 'Primary image updated');
}));

propertyRouter.delete('/:propertyId/images/:imageId', authenticate, authorize('admin', 'owner'), validate(imageParamsSchema), asyncHandler(async (request, response) => {
  const image = await propertyBusiness.deleteImage(request.params.propertyId, request.params.imageId, request);
  sendSuccess(response, image, 'Image metadata deleted');
}));
