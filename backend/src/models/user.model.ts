import { db } from "../index.js";
import bcrypt from 'bcrypt'

// create new account
const createUser = async (username: string, password: string, email: string) => {
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await db.user.create({
        data: {
            username: username,
            password: hashedPassword,
            email: email,
        }
    })
    return user;
}

//get user by username for login model
const getUserByUsername = async(username:string) => {
    const user = await db.user.findUnique({where: {username}})
    return user;
}

const getUserById = async (id:number) => {
    const user = db.user.findUnique({where: {id}})
    return user
}

// login
const loginUser = async (username:string, password:string) => {
    const user = await db.user.findUnique({where:{username}})
    if(!user) return null;
    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch) return null;
    return user;
}
//update username
const updateUsername = async (id:number,newUsername:string)=> {
    return db.user.update({
        where: {id},
        data: {
            username: newUsername
        }
    })
}


//update password
const updatePassword = async (id:number, newPassword:string) => {
    const hashedPassword = await bcrypt.hash(newPassword,10);
    return db.user.update({
        where:{id},
        data: {
            password: hashedPassword
        }
    })
}

//get user info (username, hashedpassword)
const getUserInfo = async(id:number) => {
    return db.user.findUnique({where: {id}});
}

//update picture profile
const updatePictureProfile = async (id:number,profileUrl:string) => {
    return db.user.update({
        where: {id},
        data: {
            profile:profileUrl
        },
    })
}
//update email
const updateEmail = async (id:number,email:string) => {
    return db.user.update({
        where: {id},
        data: {
            email:email
        },
    })
}

export default {createUser,
    getUserInfo,loginUser,updatePassword,
    updateUsername,updatePictureProfile,getUserById,
getUserByUsername,updateEmail}