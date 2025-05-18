import type { Context } from 'hono';
import { Prisma } from '../generated/prisma/index.js';
import * as userModel from '../models/user.model.js';
import { generateToken } from '../utils/jwtToken.js';

type AuthBody = {
  username: string;
  password: string;
};

export const getUserById = async (c: Context) => {
  const idParam = c.req.param('id');
  const userId = parseInt(idParam, 10);

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID format' }, 400);
  }

  try {
    const user = await userModel.findUserById(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
};


export const Login = async (c: Context) => {
  try {
    const { username, password } = await c.req.json<AuthBody>();

    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const isValid = await userModel.validatePassword(password, user.password);
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = generateToken(user);
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/;`);
    return c.json({ success: true, token });
  } catch (error: any) {
    console.error("Login error:", error);
    return c.json({ error: 'Failed to log in' }, 500);
  }
};

// Create user without auth (e.g., for admin panel)
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

    const user = await userModel.createUserModel(body);
    const token = generateToken(user);
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/;`);
    return c.json(user, 201);
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target;
      const isUsernameConflict = Array.isArray(target)
        ? target.includes('username')
        : target === 'username';
      if (isUsernameConflict) {
        return c.json({ error: 'Username already exists.' }, 409);
      }
    }
    return c.json({ error: 'Failed to create user' }, 500);
  }
};

// Delete user by ID
export const deleteUser = async (c: Context) => {
  const id = c.req.param('id');
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID format. ID must be an integer.' }, 400);
  }

  try {
    const result = await userModel.deleteUserModel(userId);
    if (!result) {
      return c.json({ message: 'User not found' }, 404);
    }
    return c.json({ message: 'User deleted successfully' }, 200);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
};

// Update user by ID (username/password)
export const updateUser = async (c: Context) => {
  const id = c.req.param('id');
  const userId = parseInt(id, 10);
  const body = await c.req.json();

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
    const updated = await userModel.updateUserModel(userId, body);
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
        const isUsernameConflict = Array.isArray(target)
          ? target.includes('username')
          : typeof target === 'string' && target.includes('username');
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
};

// Update password only
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

    const updatedUser = await userModel.updateUserModel(userId, { password });
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
};
