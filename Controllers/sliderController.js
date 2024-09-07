import { Slider } from "../Models/sliderMd.js"
import fs from "fs"
import { catchAsync } from './../Utils/catchAsync.js'

export const getAllSlider = catchAsync(async (req, res, next) => {
    const slider = await Slider.find(req.query)
    return res.status(200).json({
        status: true,
        data: slider
    })
})

export const createSlider = catchAsync(async (req, res, next) => {
    const slider = await Slider.create(req.body)
    return res.status(200).json({
        status: true,
        message: "slider created...",
        data: slider
    })
})

export const deleteSlider = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const slider = await Slider.findByIdAndDelete(id)

    fs.unlink(`${__dirname}/Public/${slider.image}`)

    return res.status(200).json({
        status: true,
        message: "slider deleted...",
        data: slider
    })
})