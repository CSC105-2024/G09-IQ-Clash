import { Hono } from 'hono';
import {
  createUser,
  deleteUser,
  updateUser,
  updatePassword,
  Login,
  getUserById
  
 
} from '../controllers/user.controller.js'; 

const userRoute = new Hono();


userRoute.post('/register', createUser);
userRoute.post('/login', Login);
userRoute.get('/:id',getUserById);

userRoute.post('/', createUser); 
userRoute.delete('/:id', deleteUser);
userRoute.put('/:id', updateUser);
userRoute.patch('/:id/password', updatePassword);

export default userRoute;
