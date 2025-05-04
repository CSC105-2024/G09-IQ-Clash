import type { Context } from 'hono'
import {
  createUserModel,
  deleteUserModel,
  updateUserModel,
  loginUserModel
} from '../models/user.model.js'

export const createUser = async (c: Context) => {
  const body = await c.req.json()
  const user = await createUserModel(body)
  return c.json(user, 201)
}

export const deleteUser = async (c: Context) => {
  const id = c.req.param('id')
  const result = await deleteUserModel(id)
  return c.json(result)
}

export const updateUser = async (c: Context) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const updated = await updateUserModel(id, body)
  return c.json(updated)
}

export const loginUser = async (c: Context) => {
  const body = await c.req.json()
  const result = await loginUserModel(body)
  return c.json(result)
}
