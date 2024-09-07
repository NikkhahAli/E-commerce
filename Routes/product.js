import { Router } from "express"
import { createdProduct, favoriteProduct, getAllProduct, getOneProduct, updateProduct } from './../Controllers/productController.js'
import { isAdmin } from './../middleWare/isAdmin.js'
import { isLogin } from './../middleWare/isLogin.js'

export const productRouter = Router()
productRouter.route("/").get(getAllProduct).post(isAdmin , createdProduct)
productRouter.route("/:id").get(getOneProduct).patch(isAdmin , updateProduct)
productRouter.route("/favorite/:id").post(isLogin , favoriteProduct)