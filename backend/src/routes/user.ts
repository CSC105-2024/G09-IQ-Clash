import { Hono } from 'hono';
import {
  createUser,
  deleteUser,
  updateUsername,
  updatePassword,
  Login,
  getUserById,
  logoutUser,
  decodeCookie

 
} from '../controllers/user.controller.js'; 
import { authMiddleware } from '../middlwares/auth.middleware.js';

const userRoute = new Hono();


userRoute.post('/register', createUser);//to register
userRoute.post('/login', Login); //to log in

userRoute.get('/getUserById',getUserById);
userRoute.delete('/deleteAccount',authMiddleware, deleteUser); // to delete account
userRoute.patch('/updateUsername',authMiddleware, updateUsername); //updateUsername
userRoute.patch('/updatePassword',authMiddleware, updatePassword); //to update password
userRoute.delete('/logout',authMiddleware,logoutUser); // to log out
userRoute.get('/decodeCookie',decodeCookie);//to decode the cookie

export default userRoute;
