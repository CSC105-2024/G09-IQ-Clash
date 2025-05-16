import { db } from '../index.js'
import {hash,compare} from 'bcrypt'
export interface UserData {
  username: string
  password: string
}

export const findUserById = async (id: number) => {
  return db.user.findUnique({
    where: { id },
    select: { id: true, username: true } 
  });
};

export const createUserModel = async (data: UserData) => {
  const hashPassword = await hash(data.password,10)
  return db.user.create({ data:{
    ...data,
    password:hashPassword,
  } })
}
export const findUserByUsername = async (username:string)=>{
  return db.user.findUnique({where:{username}})
}
export const validatePassword = async (input: string, hash: string) => {
  return compare(input, hash)
}

export const deleteUserModel = async (id: number) => {
  return db.user.delete({ where: { id } })
}

export const updateUserModel = async (id: number, data: Partial<UserData>) => {
  return db.user.update({ where: { id }, data, })
}

export const loginUserModel = async (data: UserData) => {
  const user = await db.user.findUnique({
    where: { username: data.username }
  })

  if (!user) return null

  const isValid = await compare(data.password, user.password)
  if (!isValid) {
    return { error: 'Invalid credentials' }
  }
  return user
}

