import { Router } from "express"
import { isAdmin } from './../middleWare/isAdmin.js'
import { getMostSoldProductByCategory, productMostSell, userMostBuy, userMostPurchase } from "../Controllers/reportController.js"

export const reportRouter = Router()

reportRouter.route("/user-most-purchase").get(isAdmin , userMostPurchase)
reportRouter.route("/user-most-buy").get(isAdmin , userMostBuy)
reportRouter.route("/product-most-sell").get(isAdmin , productMostSell)
reportRouter.route("/category-product-most-sell").get(getMostSoldProductByCategory)
