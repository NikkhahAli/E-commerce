import { Product } from "../Models/productMd.js"
import { User } from "../Models/userMd.js"
import { catchAsync } from "../Utils/catchAsync.js"
import { ApiFeatures } from './../Utils/apiFeatures.js'
import jwt from 'jsonwebtoken'

export const getAllProduct = catchAsync(async (req, res, next) => {
    // const query={...req.query,populate:{path:'productVariantIds',populate:{
    //     path:'variantId',
    //     model:'Variant'
    // }}}

    const query={...req.query}

    // const features = new ApiFeatures(Product, query).filters().sort().limit().paginate().populate().secondPopulate(req.query.populate || '')
    const features = new ApiFeatures(Product, query).filters().sort().limit().paginate().populate()
    const product = await features.model
    return res.status(200).json({
        status: true,
        data: product,
        resultCount: product.length
    })
})

export const getOneProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params

    let isFavorite = false
    let isCustomer = false

    if (req.headers.authorization) {

        const { id: tokenId } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
        const user = await User.findById(tokenId)
        let recently = user.recentlyProduct

        if (user.favoriteProduct.includes(id)) {
            isFavorite = true
        }

        if (user.boughtProductId.includes(id)) {
            isCustomer = true
        }

        if (recently < 10) {
            recently.push(id)
        }
        else {
            recently.shift()
            recently.push()
        }

        await User.findByIdAndUpdate(tokenId, { recentlyProduct })
    }

    const product = await Product.findById(id).populate("productVariantId")
    return res.status(200).json({
        status: true,
        isFavorite,
        isCustomer,
        data: product
    })
})

export const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).populate("productVariant")
    return res.status(200).json({
        status: true,
        message: "product updated...",
        data: product
    })
})

export const createdProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body)
    return res.status(200).json({
        status: true,
        message: "product created...",
        data: product
    })
})

export const favoriteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { id: tokenId } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)

    const user = await User.findById(tokenId)
    
    if (user.favoriteProduct.includes(id)) {
        await User.findByIdAndUpdate(tokenId, { $pull: { favoriteProduct: id } })
        return res.status(200).json({
            status: true,
            message: "product deleted from favorite...",
        })
    }
    else {
        await User.findByIdAndUpdate(tokenId, { $push: { favoriteProduct: id } })
        return res.status(200).json({
            status: true,
            message: "product add to favorite...",
        })
    }
})
