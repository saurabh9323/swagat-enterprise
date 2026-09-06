import { Router } from 'express';
import * as userBusiness from '../business/userBusiness.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responses.js';
import { userCreateSchema, userParamsSchema, userQuerySchema, userUpdateSchema } from '../validation/userSchemas.js';

export const userRouter = Router();

userRouter.use(authenticate, authorize('owner', 'admin'));

userRouter.get('/', validate(userQuerySchema), asyncHandler(async (request, response) => {
  const users = await userBusiness.listUsers(request.query);
  response.json(users);
}));

userRouter.post('/', validate(userCreateSchema), asyncHandler(async (request, response) => {
  const user = await userBusiness.createUser(request.body, request.user);
  sendSuccess(response, user, 'User created', 201);
}));

userRouter.get('/:id', validate(userParamsSchema), asyncHandler(async (request, response) => {
  const user = await userBusiness.getUser(request.params.id);
  response.json(user);
}));

userRouter.patch('/:id', validate(userUpdateSchema), asyncHandler(async (request, response) => {
  const user = await userBusiness.updateUser(request.params.id, request.body, request.user);
  sendSuccess(response, user, 'User updated');
}));

userRouter.delete('/:id', validate(userParamsSchema), asyncHandler(async (request, response) => {
  const user = await userBusiness.deactivateUser(request.params.id, request.user);
  sendSuccess(response, user, 'User deactivated');
}));
