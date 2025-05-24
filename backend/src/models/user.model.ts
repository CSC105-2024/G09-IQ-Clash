import { db } from '../index.js'
import {hash,compare} from 'bcrypt'
import bcrypt from 'bcrypt'
export interface UserData {
  username: string
  password: string
}

export const findUserById = async (id: number) => {
  return db.user.findUnique({
    where: { id },
  });
};

export const getuserByUsername = async(username:string) => {
  const user = await db.user.findUnique({where: {username}});
  if(!user) return null;
  return user;
}

//create account
export const createUserModel = async (_username:string,password:string) => {
  const hashPassword = await hash(password,10)
  return db.user.create({ data:{
    username:_username,
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

//update username
export const updateUsername = async (id:number,newUsername:string) => {
  return db.user.update({
    where:{id},
    data:{
      username:newUsername
    }
  })
}

//update password
export const updatePassword = async(id:number,newPassword:string) => {
  const hashedPassword = await bcrypt.hash(newPassword,10);
    return db.user.update({
      where:{id},
      data: {
        password: hashedPassword
      }
    })
}

export const loginUserModel = async (username: string, password:string) => {
    const user = await db.user.findUnique({where:{username}})
    if(!user) return null;
    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch) return null;
    return user;
}

