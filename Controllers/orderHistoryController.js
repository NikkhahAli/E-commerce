import { catchAsync } from '../Utils/catchAsync.js'
import { ProductVariant } from './../Models/productVariantMd.js'
import { DiscountCode } from './../Models/discountCodeMd.js'
import { User } from './../Models/userMd.js'
import { ApiFeatures } from './../Utils/apiFeatures.js'
import jwt from 'jsonwebtoken'
import HandleError from './../Utils/handleError.js';
import { OrderHistory } from '../Models/orderHistoryMd.js'

export const validDiscount = async (code, id) => {
    if (!code) {
        return {
            success: true,
            discount: 0
        }
    }
    const discountCode = await DiscountCode.findOne({ code })
    const user = await User.findById(id)
    let now = new Date.now()
    if (discountCode.expireTime < now || discountCode.startTime > now) {
        return {
            success: false,
            message: "discount code is not valid"
        }
    }
    else if (user.usedDiscountCode.includes(code)) {
        return {
            success: false,
            message: "discount code is already used"
        }
    }
    else if (!discountCode.isActive) {
        return {
            success: false,
            message: "discount code is not valid"
        }
    }

    return {
        success: true,
        discount: discountCode?.discount,
        freeShipping: freeShipping
    }
}

export const payment = catchAsync(async (req, res, next) => {
    const { discount = null, addressId = null } = req.body
    if (addressId) {
        return next(new HandleError("choose your address", 400))
    }

    const { id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const user = await User.findById(id)

    const discountChecking = await validDiscount(discount, id)

    if (user.cart.item.length == 0 || +user.cart.totalPrice <= 0) {
        return next(new HandleError(discountChecking.message, 400))
    }
    if (!discount.success) {
        return next(new HandleError(discountChecking.message, 400))
    }

    let items = user.cart.item
    let change = false
    let newTotalPrice = 0
    let currentTotalPrice = user.cart.totalPrice

    let newItems = []

    for (const item of items) {
        const pr = await ProductVariant.findById(item.productVariantId)
        if (pr.quantity >= item.quantity) {
            newItems.push(item)
            newTotalPrice += item.quantity * pr.finalPrice
        }
        else {
            change = true
            item.quantity = pr.quantity
            newTotalPrice += item.quantity * pr.finalPrice
            newItems.push(item)
        }
    }

    if (currentTotalPrice !== newTotalPrice) {
        change = true
    }

    if (change) {
        const newUser = await User.findByIdAndUpdate(id, { cart: { item: newItems, totalPrice: newTotalPrice } })
        return res.status(200).json({
            message: "user basket updated...",
            success: false
        })
    }
    for (let item of newItems) {
        const pr = await ProductVariant.findByIdAndUpdate(item.productVariantId, { quantity: { $inc: -item.quantity } })
    }
    // request to zarin pal 

    // end req give me authority and link

    let priceAfterDiscount = newTotalPrice * (1 - discountChecking.discount / 100)
    let authority = Math.trunc(Math.random() * 10 ** 10)
    const orderHistory = await OrderHistory.create({ userId: id, totalPrice: priceAfterDiscount, items: newItems, discountCode: discount, addressId, authority, freeShipping: discountChecking.freeShipping })
    return res.status(200).json({
        success: true,
        message: "order confirmd successfully",
        authority,
        link: ""
    })
})

export const checkOrder = async () => {
    const pastTime = new Date(Date.now() - 900000)
    const orders = await OrderHistory.find({ status: "pending", createdAt: { $lt: pastTime } })
    if (orders.length == 0) {
        return
    }
    for (let order of orders) {
        for (let item of order.items) {
            const pr = await ProductVariant.findByIdAndUpdate(item.productVariantId, { quantity: { $inc: item.quantity } })
        }
        order.status = "failed"
        await order.save()
    }
}

export const checkPayment = catchAsync(async (req, res, next) => {
    const authority = req.body.authority
    const order = await OrderHistory.findOne({ authority })

    let resultPayment = true

    if (resultPayment) {
        order.success = "success"
        await order.save()
    }
    else {
        order.status = "failed"
        await order.save()
    }
    return res.status(200).json({
        success: resultPayment,
        message: resultPayment ? "payment has done successfully" : "payment has failed"
    })
})

export const getAllOrderHistory = catchAsync(async (req, res, next) => {
    const { role, id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    let queryString = { ...req.query, filters: role == "admin" || role == "superAdmin" ? req.query.filters : { ...req.query.filters, userId: id } }
    const features = new ApiFeatures(OrderHistory, queryString).filters().sort().limit().paginate().populate()
    const order = await features.model
    return res.status(200).json({
        status: true,
        data: order
    })
})

export const getOneOrderHistory = catchAsync(async (req, res, next) => {
    const { role, id: tokenId } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const { id } = req.params
    const order = await OrderHistory.findById(id)

    if (role !== "Admin" && role !== "superAdmin" && order.userId !== tokenId) {
        return next(new HandleError("You cannot access", 401))
    }
    return res.status(200).json({
        status: true,
        data: order
    })
})
