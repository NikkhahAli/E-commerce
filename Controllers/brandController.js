import { __dirname } from "../app.js"
import fs from "fs"
import { Brand } from './../Models/brandMd.js'
import { catchAsync } from "../Utils/catchAsync.js"
import { ApiFeatures } from "../Utils/apiFeatures.js"
import { Category } from "../Models/categoryMd.js"

export const getAllBrand = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Brand, req.query).filters().sort().limit().paginate().populate()
    const brand = await features.model
    return res.status(200).json({
        status: true,
        data: brand
    })
})

export const getBrand = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const brand = await Brand.findById(id)
    return res.status(200).json({
        status: true,
        data: brand
    })
})

export const updateBrand = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const brand = await Brand.findById(id)
    const { image, ...others } = req.body

    if (!brand) {
        return res.status(404).json({
            success: false,
            message: 'Not found brand',
        })
    }
    if (image && image !== brand.image) {
        if (brand.image) {
            fs.unlinkSync(`${__dirname}/Public/${brand.image}`)
        }
    }
    const updateData = image ? req.body : others
    const newBrand = await Brand.findByIdAndUpdate(id, updateData, {new: true,runValidators: true})
    return res.status(200).json({
        success: true,
        data: newBrand ,
        message: "Brand updated....",
    })
})

export const createBrand = catchAsync(async (req ,res,next) => {
    const brand = await Brand.create(req.body)
    for (let catId of brand.categoryId) {
        await Category.findByIdAndUpdate(catId , {$push : {brands:brand._id}})
    }
    return res.status(200).json({
        status : true ,
        data : brand ,
        message : "brand updated..."
    })
})

export const deleteBrand = catchAsync(async (req,res,next) => {
    const { id } = req.params
    const brand = await Brand.findByIdAndDelete(id)
    if (brand.image) {
        fs.unlinkSync(`${__dirname}/Public/${brand.image}`)
    }
    for (let catId of brand.categoryId) {
        await Category.findByIdAndUpdate(catId , {$pull : {brands:brand._id}})
    }
    return res.status(200).json({
        status : true ,
        message : "brand deleted"
    })
})