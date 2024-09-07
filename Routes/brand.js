import { Router } from "express"
import { createBrand, deleteBrand, getAllBrand, getBrand, updateBrand } from "../Controllers/brandController.js"
import { isAdmin } from "../middleWare/isAdmin.js"
export const brandRouter = Router()

brandRouter.route("/").get(getAllBrand).post(isAdmin , createBrand)
brandRouter.route("/:id").get(isAdmin , getBrand).patch(isAdmin ,updateBrand).delete(isAdmin , deleteBrand)
