import { Hono } from "hono";
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";

const mainRouter = new Hono()

mainRouter.route('/user',userRoute) // to login/logout update profile/ password/username
mainRouter.route('/post',postRoute)
export default mainRouter