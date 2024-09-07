import { Router } from "express"
import { isAdmin } from "../middleWare/isAdmin.js"
import { getAllUser, getOneUser, updateUser } from "../Controllers/userController.js"
import { isLogin } from './../middleWare/isLogin.js';

export const userRouter = Router()
userRouter.route("/").get(isAdmin , getAllUser)
userRouter.route("/:id").get(isLogin , getOneUser).patch(updateUser)
