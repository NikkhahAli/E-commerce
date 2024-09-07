import { Router } from "express"
import { isLogin } from './../middleWare/isLogin.js'
import { checkPayment, getAllOrderHistory, getOneOrderHistory, payment } from "../Controllers/orderHistoryController.js"

export const orderHistoryRouter = Router()

orderHistoryRouter.route("/").get(isLogin , getAllOrderHistory)
orderHistoryRouter.route("/check-payment").post(checkPayment)
orderHistoryRouter.route("/payment").get(isLogin, payment)
orderHistoryRouter.route("/:id").get(isLogin, getOneOrderHistory)
