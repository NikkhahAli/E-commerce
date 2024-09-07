import { Router } from "express";
import { isAdmin } from './../middleWare/isAdmin.js'
import { checkDiscount, createDiscount, getAllDiscount, getOneDiscount, updateDiscount } from "../Controllers/discountCodeController.js";
import { isLogin } from './../middleWare/isLogin.js'

export const discountCodeRouter = Router()
discountCodeRouter.route("/").post(isAdmin, createDiscount).get(isAdmin , getAllDiscount)
discountCodeRouter.route("/:id").get(isAdmin ,getOneDiscount).patch(isAdmin , updateDiscount)
discountCodeRouter.route("/check").get(isLogin , checkDiscount)