import { Router } from "express"
import { search } from "../Controllers/searchController.js"
export const searchRouter = Router()

// searchRouter.route("/search").get(search)
searchRouter.route("/").get(search)