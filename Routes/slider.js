import { Router } from "express";
import { createSlider, deleteSlider, getAllSlider } from "../Controllers/sliderController.js"
import { isAdmin } from './../middleWare/isAdmin.js'

export const sliderRouter = Router()
sliderRouter.route("/").get(getAllSlider).post(isAdmin , createSlider)
sliderRouter.route("/:id").delete(isAdmin , deleteSlider)
