import { Router } from "express";
import { isAdmin } from "../middleWare/isAdmin.js";
import { createVariant, getAllVariant, getVariant, updateVariant } from "../Controllers/variantController.js";

export const variantRouter = Router()

variantRouter.route("/").get(isAdmin , getAllVariant).post(isAdmin , createVariant)
variantRouter.route("/:id").get(isAdmin , getVariant).patch(isAdmin , updateVariant)