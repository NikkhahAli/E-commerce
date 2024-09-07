import { Router } from "express"
import { search } from "../Controllers/searchController.js"
export const searchRouter = Router()


searchRouter.route("/").get(search)