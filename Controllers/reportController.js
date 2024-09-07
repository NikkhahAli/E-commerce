import { OrderHistory } from "../Models/orderHistoryMd.js"
import { catchAsync } from "../Utils/catchAsync.js"
import HandleError from "../Utils/handleError.js"

export const userMostBuy = catchAsync(async (req, res, next) => {
    const { limit = 100, sort = -1 } = req.body
    const users = await OrderHistory.aggregate([
        {
            $match: { status: "success" }
        },
        {
            $group: {
                _id: "$userId",
                totalPurchase: { $sum: 1 }
            }
        },
        {
            $sort: sort
        },
        {
            $limit: limit
        }
    ])
    return res.status(200).json({
        status: true,
        data: users
    })
})

export const userMostPurchase = catchAsync(async (req, res, next) => {
    const { limit = 100, sort = -1 } = req.body
    const users = await OrderHistory.aggregate([
        {
            $match: { status: "success" }
        },
        {
            $group: {
                _id: "$userId",
                totalPurchase: { $sum: "$totalPrice" }
            }
        },
        {
            $sort: sort
        },
        {
            $limit: limit
        }
    ])
    return res.status(200).json({
        status: true,
        data: users
    })
})

export const productMostSell = catchAsync(async (req, res, next) => {
    const { limit = 100, sort = -1 } = req.body
    const product = await OrderHistory.aggregate([
        {
            $match: { status: "success" }
        },
        {
            $unwind: '$items'
        },
        {
            $group: {
                _id: "$items.productId",
                totalSold: { $sum: "$quantity" }
            }
        },
        {
            $sort: { totalSold: sort }
        },
        {
            $limit: limit
        }
    ])
    return res.status(200).json({
        status: true,
        data: product
    })
})

export const getMostSoldProductByCategory = catchAsync(async (req, res, next) => {
    const { limit = 100, sort = -1, categoryId = null} = req.body

    if (!categoryId) {
        return next(new HandleError("categoryId is required" , 400))
    }

    const products = await OrderHistory.aggregate([
        {
            $match: { status: "success" },
        },
        {
            $unwind: "$items"
        },
        {
            $match: { "items.categoryId": categoryId }
        },
        {
            $group: {
                _id: "$items.productVariantId",
                totalSold : {$sum : "$quantity"},
            }
        },
        {
            $sort : {totalSold : sort}
        },
        {
            $limit : limit
        }
    ])
    return res.status(200).json({
        status : true ,
        data : products
    })
})