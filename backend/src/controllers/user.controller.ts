import type { Context } from 'hono'
import { Prisma } from '../generated/prisma/index.js';
import {
  createUserModel,
  deleteUserModel,
  updateUserModel,
  loginUserModel,
} from '../models/user.model.js'

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();

    if (typeof body.username !== 'string' || typeof body.password !== 'string') {
      return c.json({ error: 'Username and password are required and must be strings.' }, 400);
    }
    if (body.username.trim().length < 1) {
      return c.json({ error: 'Username cannot be empty.' }, 400);
    }
    if (body.password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters long.' }, 400);
    }

    const user = await createUserModel(body);
    return c.json(user, 201);

  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target;
      let isUsernameConflict = false;

      if (Array.isArray(target)) {
        isUsernameConflict = target.includes('username');
      } else if (typeof target === 'string') {
        isUsernameConflict = target === 'username';
      }

      if (isUsernameConflict) {
        return c.json({ error: 'Username already exists.' }, 409);
      }
    }

    return c.json({ error: 'Failed to create user' }, 500);
  }
}

export const deleteUser = async (c: Context) => {
  const id = c.req.param('id');
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID format. ID must be an integer.' }, 400);
  }

  try {
    const result = await deleteUserModel(userId);
    if (result === null || result === undefined) {
      return c.json({ message: 'User not found' }, 404);
    }
    return c.json({ message: 'User deleted successfully' }, 200);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
}

export const updateUser = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID format. ID must be an integer.' }, 400);
  }

  if (body.username !== undefined) {
    if (typeof body.username !== 'string' || body.username.trim().length === 0) {
      return c.json({ error: 'Username must contain at least 1 character.' }, 400);
    }
    body.username = body.username.trim();
  }

  if (body.password && typeof body.password === 'string' && body.password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters long.' }, 400);
  }

  try {
    const updated = await updateUserModel(userId, body);
    if (!updated) {
      return c.json({ message: 'User not found' }, 404);
    }
    const { password: _, ...userWithoutPassword } = updated;
    return c.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return c.json({ message: 'User not found' }, 404);
      }
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        let isUsernameConflict = false;
        if (Array.isArray(target)) {
          isUsernameConflict = target.includes('username');
        } else if (typeof target === 'string') {
          isUsernameConflict = target.includes('username');
        }
        if (isUsernameConflict) {
          return c.json({ error: 'Username already exists.' }, 409);
        }
      }
    }
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON payload' }, 400);
    }
    return c.json({ error: 'Failed to update user' }, 500);
  }
}
export const updatePassword = async (c: Context) => {
  const id = c.req.param('id');
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID format. ID must be an integer.' }, 400);
  }

  try {
    const { password } = await c.req.json<{ password: string }>();

    if (typeof password !== 'string' || password.length < 6) {
      return c.json({ error: 'New password must be a string and at least 6 characters long.' }, 400);
    }
    const updatedUser = await updateUserModel(userId, { password: password });
    if (!updatedUser) {
      return c.json({ message: 'User not found' }, 404);
    }
    const { password: _, ...userWithoutPassword } = updatedUser;
    return c.json(userWithoutPassword);

  } catch (error: any) {
    console.error("Error updating password:", error);
    if (error instanceof SyntaxError) {
      return c.json({ error: 'Invalid JSON payload, expected { "password": "newpassword" }' }, 400);
    }
    return c.json({ error: 'Failed to update password' }, 500);
  }
}
export const loginUser = async (c: Context) => {
  try {
    const body = await c.req.json()
    if (typeof body.username !== 'string' || typeof body.password !== 'string') {
      return c.json({ error: 'Username and password are required.' }, 400);
    }
    const result = await loginUserModel(body)
    if (!result) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }
    if (typeof result === 'object' && result !== null && 'error' in result) {
      const errorMessage = typeof result.error === 'string' ? result.error : 'Invalid username or password';
      return c.json({ error: errorMessage }, 401);
    }
    return c.json(result)

  } catch (error: any) {
    console.error("Error logging in user:", error);
    return c.json({ error: 'Login failed due to server error' }, 500);
  }
}
