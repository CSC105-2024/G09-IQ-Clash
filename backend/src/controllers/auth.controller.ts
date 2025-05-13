import type { Context } from 'hono'
import * as authModel from '../models/user.model.js'
import { generateToken   } from '../utils/jwtToken.js' 
type AuthBody = {
  username: string
  password: string
}


export const authSignup = async (c: Context) => {
  try {
    const { username, password } = await c.req.json<AuthBody>()
    const userData:authModel.UserData ={
        username,
        password,
    }
    const existing = await authModel.findUserByUsername(username)
    if (existing) {
      return c.json({ success: false, msg: 'Username already taken' }, 409)
    }

    const user = await authModel.createUserModel(userData)
    const token = generateToken(user)
    //set JWT as cookie
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);
    return c.json({ success: true, token }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ success: false, msg: 'Failed to create user' }, 500)
  }
}

export const authLogin = async (c: Context) => {
  try {
    const { username, password } = await c.req.json<AuthBody>()

    const user = await authModel.findUserByUsername(username)
    if (!user) {
      return c.json({ success: false, msg: 'Invalid credentials' }, 401)
    }

    const isValid = await authModel.validatePassword(password, user.password)
    if (!isValid) {
      return c.json({ success: false, msg: 'Invalid credentials' }, 401)
    }

    const token = generateToken(user)
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);
    return c.json({ success: true, token })
  } catch (error) {
    console.error(error)
    return c.json({ success: false, msg: 'Failed to log in' }, 500)
  }
}