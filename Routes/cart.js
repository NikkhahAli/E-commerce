import { Router } from "express"
import { isAdmin } from './../middleWare/isAdmin.js';
import { addToCart, clearCart, getCart, removeFromCart } from "../Controllers/cartController.js";
import { isLogin } from './../middleWare/isLogin.js';

export const cartRouter = Router()

cartRouter.route("/").get(isLogin , getCart).delete(isLogin , clearCart)
cartRouter.route("/add").post(addToCart)
cartRouter.route("/remove").delete(removeFromCart)