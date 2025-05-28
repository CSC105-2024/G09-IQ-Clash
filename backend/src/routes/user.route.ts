import { Hono } from "hono";
import { createUser, decodeCookie, loginUser, logoutUser, 
    updateEmail, 
updatePassword, updateProfile, updateUsername} from "../controllers/user.controller.js";

import{ authMiddleware } from "../middlewares/auth.js";

const userRoute = new Hono();

userRoute.post('/register',createUser); 
userRoute.post('/login',loginUser); 
//update profile picutre
userRoute.patch('/updateProfile',authMiddleware,updateProfile);  
//update username / password / email
userRoute.patch('/updateUsername',authMiddleware,updateUsername)  
userRoute.patch('/updatePassword',authMiddleware,updatePassword)
userRoute.patch('/updateEmail',authMiddleware,updateEmail)
//logout
userRoute.delete('/logout',logoutUser) 
//decode cookie
userRoute.get('/decodeCookie',decodeCookie);
export default userRoute