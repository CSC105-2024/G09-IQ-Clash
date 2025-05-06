import { Hono } from 'hono'
import {createUser,deleteUser,updateUser,loginUser} from '../controllers/user.controller.js'

const userRoutes = new Hono()

userRoutes.post('/register', createUser)
userRoutes.post('/login', loginUser)
userRoutes.delete('/:id', deleteUser)
userRoutes.patch('/:id', updateUser)

export default userRoutes
