import { db } from '../index.js'

interface UserData {
  username: string
  password: string
}

export const createUserModel = async (data: UserData) => {
  return db.user.create({ data })
}

export const deleteUserModel = async (id: string) => {
  return db.user.delete({ where: { id } })
}

export const updateUserModel = async (id: string, data: Partial<UserData>) => {
  return db.user.update({ where: { id }, data })
}

export const loginUserModel = async (data: UserData) => {
  const user = await db.user.findUnique({ 
    where: { username: data.username }
  })
  if (!user || user.password !== data.password) {
    throw new Error('Invalid credentials')
  }
  return user
}
