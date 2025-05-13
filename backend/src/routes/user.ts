import { Hono } from 'hono'
import {createUser,deleteUser,updateUser,loginUser,updatePassword} from '../controllers/user.controller.js'
import { authMiddleware } from '../middlwares/auth.middleware.js'
import { authLogin, authSignup } from '../controllers/auth.controller.js'
const userRoutes = new Hono()

userRoutes.post('/register',authSignup, createUser)
userRoutes.post('/login',authLogin, loginUser)


userRoutes.delete('/:id',authMiddleware, deleteUser)
userRoutes.patch('/editUsername/:id',authMiddleware, updateUser)
userRoutes.patch('/editPassword/:id',authMiddleware ,updatePassword)
export default userRoutes
