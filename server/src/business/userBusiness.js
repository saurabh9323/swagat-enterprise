import * as userService from '../services/userService.js';
import { ApiError } from '../utils/ApiError.js';

export async function createUser(payload, actor) {
  if (actor.role !== 'super_admin' && ['super_admin', 'owner'].includes(payload.role)) {
    throw new ApiError(403, 'Only super admin can create super admin or owner accounts');
  }

  return userService.createUser(payload, actor.id);
}

export async function listUsers(query) {
  return userService.getUsers(query);
}

export async function getUser(id) {
  const user = await userService.getUserById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

export async function updateUser(id, payload, actor) {
  if (actor.role !== 'super_admin' && ['super_admin', 'owner'].includes(payload.role)) {
    throw new ApiError(403, 'Only super admin can assign super admin or owner role');
  }

  const user = await userService.updateUser(id, payload);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

export async function deactivateUser(id, actor) {
  if (actor.id === id) {
    throw new ApiError(400, 'You cannot deactivate your own account');
  }

  const user = await userService.deactivateUser(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}
