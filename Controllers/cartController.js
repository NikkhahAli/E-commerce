import { catchAsync } from './../Utils/catchAsync.js'
import { User } from './../Models/userMd.js'
import jwt from "jsonwebtoken"
import HandleError from './../Utils/handleError.js';
import { ProductVariant } from './../Models/productVariantMd.js';


export const clearCart = catchAsync(async (req, res, next) => {
    const { id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const user = await User.findByIdAndUpdate(id, { cart: { totalPrice: 0, item: [] } }, { new: true, runValidators: true })
    return res.status(200).json({
        status: true,
        data: user.cart
    })
})


export const addToCart = catchAsync(async (req, res, next) => {
    const { id } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
    const user = await User.findById(id)
    const { productId = null, productVariantId = null } = req.body

    if (!productId || !productVariantId) {
        return next(new HandleError("productId and productVariantId is required", 400))
    }

    const pr = await ProductVariant.findById(productVariantId).populate("productId")

    let add = false
    let item = user.cart.item
    let currentTotalPrice = 0
    let totalPrice = user.cart.totalPrice + pr.finalPrice

    item = item.map((e) => {
        if (e.productId == productId && e.productVariantId == productVariantId) {
            e.quantity++
            add = true
            return e
        }
        return e
    })
    
    if (!add) {
        item.push({ productId, productVariantId , quantity : 1 , categoryId:pr.productId.categoryId })
    }

    const newUser = await User.findByIdAndUpdate(id, { cart: { totalPrice, item } }, { new: true, runValidators: true })
    return res.status(200).json({
        status: true,
        data: newUser
    })
})

export const removeFromCart = catchAsync(async (req, res, next) => {
    const { id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const { productId = null, productVariantId = null } = req.body

    if (!productId || !productVariantId) {
        return next(new HandleError("productId and productVariantId is required", 400))
    }
    const user = await User.findById(id)

    const pr = await ProductVariant.findOne(productVariantId)

    let item = user.cart.item
    let totalPrice = user.cart.totalPrice

    item = item.filter((e) => {
        if (e.productId == productId && e.productVariantId == productVariantId) {
            e.quantity--
            totalPrice -= pr.finalPrice
            if (e.quantity > 0) {
                return e
            }
            return false
        }
        return true
    })

    const newUser = await User.findByIdAndUpdate(id, { cart: { totalPrice, item } }, { new: true, runValidators: true })
    return res.status(200).json({
        status: true,
        data: newUser
    })
})

export const getCart = catchAsync(async (req, res, next) => {
    const { id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const user = await User.findById(id)
    return res.status(200).json({
        status: true,
        data: user.cart
    })
})