import { Router } from "express"
import { createAddress, deActiveAddress, getAddress, getAllAddress, updateAddress } from "../Controllers/addressController.js"
import { isLogin } from './../middleWare/isLogin.js'
export const addressRouter = Router()
addressRouter.route("/").get(getAllAddress).post(createAddress)
addressRouter.route("/:id").get(getAddress).patch(updateAddress).delete(deActiveAddress)