import { Router } from "express";
import { createComment, deleteComment, getAllComment, getComment, getProductComments, isPublish, updateComment } from "../Controllers/commentController.js";
import { isAdmin } from './../middleWare/isAdmin.js'
import { isLogin } from './../middleWare/isLogin.js'

export const commentRouter = Router()

commentRouter.route("/").get(isAdmin , getAllComment).post(isLogin , createComment)
commentRouter.route("/:id").get(isAdmin ,getComment).patch(isLogin , updateComment).delete(isAdmin , deleteComment).post(isAdmin , isPublish)
commentRouter.route("/product-comment/:id").get(getProductComments)
