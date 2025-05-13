import { Hono } from 'hono'
import {createUser,deleteUser,updateUser,loginUser,updatePassword} from '../controllers/user.controller.js'
import { authMiddleware } from '../middlwares/auth.middleware.js'
const userRoutes = new Hono()

userRoutes.post('/register', createUser)
userRoutes.post('/login', loginUser)


userRoutes.delete('/:id',authMiddleware, deleteUser)
userRoutes.patch('/editUsername/:id',authMiddleware, updateUser)
userRoutes.patch('/editPassword/:id',authMiddleware ,updatePassword)
export default userRoutes
