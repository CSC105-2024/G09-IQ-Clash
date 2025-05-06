import { Hono } from 'hono'
import {createUser,deleteUser,updateUser,loginUser,updatePassword} from '../controllers/user.controller.js'

const userRoutes = new Hono()

userRoutes.post('/register', createUser)
userRoutes.post('/login', loginUser)
userRoutes.delete('/:id', deleteUser)
userRoutes.patch('/editUsername/:id', updateUser)
userRoutes.patch('/editPassword/:id', updatePassword)
export default userRoutes
