import { Comment } from './../Models/commentMd.js'
import { catchAsync } from "../Utils/catchAsync.js"
import { Product } from './../Models/productMd.js'
import HandleError from './../Utils/handleError.js'
import { ApiFeatures } from '../Utils/apiFeatures.js'

export const getAllComment = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Comment, req.query).filters().sort().limit().paginate().populate()
    const comment = await features.model
    return res.status(200).json({
        success: true,
        data:  comment,
    })
})

export const getComment = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const comment = await Comment.findById(id)
    return res.status(200).json({
        success: true,
        data: comment,
    })
})

export const updateComment = catchAsync(async (req, res, next) => {
    const { id: commentId } = req.params
    const { id } = jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET)
    const comment = await Comment.findById(commentId)

    if (id != comment.userId) {
        return next(new HandleError("This comment belongs to other", 401))
    }

    const newComment = await Comment.findByIdAndUpdate(id,{ content: req?.body?.content || "" },{ new: true, runValidators: true })

    return res.status(200).json({
        success: true,
        message: "comment changed successfully",
        data: {
            comment: newComment,
        },
    })
})

export const createComment = catchAsync(async (req, res, next) => {
    // const { id } = jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_SECRET)

    const comment = await Comment.create({ ...req.body })

    if (req?.body?.isCustomer && req?.body?.rating) {
        const aggregate = await Comment.aggregate([
            {
                $match: { productId: req?.body?.productId }, // میگم برو اون هایی رو بگرد پیدا کن روش عملیات انجام بده که با این برابر باشند
            },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$rating"},
                    count: { $sum : 1 },
                },
            },
        ])
        await Product.findByIdAndUpdate(req?.body?.productId, {averageRate: aggregate.averageRating,rateCount: aggregate.count,})
    }

    return res.status(200).json({
        success: true,
        data: { comment },
        message: "comment commited successfully",
    })
})

export const deleteComment = catchAsync(async (req, res, next) => {
    const { id: commentId } = req.params
    const { role, id } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)

    const comment = await Comment.findById(commentId)

    if (role !== "admin" && role !== "superAdmin" && id != comment.userId) {
        return next(new HandleError("This comment belongs to other", 401))
    }

    await Comment.findByIdAndDelete(id)

    return res.status(200).json({
        success: true,
        message: " comment deleted...",
    })
})

export const isPublish = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const newComment = await Comment.findByIdAndUpdate(id, { isPublish: true }, { new: true, runValidators: true })
    return res.status(200).json({
        success: true,
        message: "comment changed successfully",
        data: {
            comment: newComment,
        },
    })
})
export const getProductComments = catchAsync(async (req, res, next) => {
    const { id: productId } = req.params

    const comment = await Comment.find({ productId, isPublish: true })
    return res.status(200).json({
        success: true,
        data: comment,
    })
})
