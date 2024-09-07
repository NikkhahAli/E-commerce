import { Router } from "express"
import { createProductVariant, deletedProductVariant, getAllProductVariant, getProductVariant, updateProductVariant } from "../Controllers/productVariantController.js"
import { isAdmin } from "../middleWare/isAdmin.js"
export const productVariantRouter = Router()
productVariantRouter.route("/").get(getAllProductVariant).post(isAdmin , createProductVariant)
productVariantRouter.route("/:id").get(getProductVariant).patch(isAdmin , updateProductVariant).delete(isAdmin , deletedProductVariant)
