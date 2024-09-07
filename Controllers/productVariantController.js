import { ProductVariant } from "../Models/productVariantMd.js"
import { catchAsync } from './../Utils/catchAsync.js'
import fs from 'fs'
import { __dirname } from "../app.js"
import { Product } from "../Models/productMd.js"

export const getAllProductVariant = catchAsync(async (req, res, next) => {
    const { id: productId } = req.params
    const productVariant = await ProductVariant.find({ productId }).populate("variantId")
    return res.status(200).json({
        status: true,
        data: productVariant
    })
})

export const getProductVariant = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const productVariant = await ProductVariant.findById(id)
    return res.status(200).json({
        status: true,
        data: productVariant
    })
})

export const updateProductVariant = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { image = '', ...others } = req.body

    const productVariant = await ProductVariant.findById(id)

    if (image && image !== productVariant.image) {
        fs.unlinkSync(`${__dirname}/Public/${productVariant.image}`)
    }

    const updateData = image ? req.body : others
    
    const newproductVariant = await ProductVariant.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    return res.status(200).json({
        status: true,
        message: "product variant updated...",
        data: newproductVariant
    })
})


export const createProductVariant = catchAsync(async (req, res, next) => {
    const productVariant = await ProductVariant.create(req.body)
    await Product.findByIdAndUpdate(req.body?.productId, { $push: { productVariantIds: productVariant._id } })
    return res.status(200).json({
        status: true,
        message: "product variant created...",
        data: productVariant
    })
})

export const deletedProductVariant = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const productVariant = await ProductVariant.findByIdAndDelete(id)
    await Product.findByIdAndUpdate(productVariant.productId, { $pull: { productVariantIds: productVariant._id } })
    if (productVariant?.image) {
        fs.unlink(`${__dirname}/Public/${productVariant.image}`)
    }
    return res.status(200).json({
        status: true,
        message: "product variant created...",
        data: productVariant
    })
})
