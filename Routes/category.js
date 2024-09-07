import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../Controllers/categoryController.js"
import { isAdmin } from "../middleWare/isAdmin.js"

export const categoryRouter = Router()
categoryRouter.route("/").get(getAllCategory).post(isAdmin, createCategory)
categoryRouter.route("/:id").get(getCategory).patch(isAdmin , updateCategory).delete(isAdmin , deleteCategory) 