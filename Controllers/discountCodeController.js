import { DiscountCode } from "../Models/discountCodeMd.js"
import { ApiFeatures } from "../Utils/apiFeatures.js"
import { catchAsync } from "../Utils/catchAsync.js"
import jwt from "jsonwebtoken"
import HandleError from "../Utils/handleError.js"
import { User } from "../Models/userMd.js"

export const getAllDiscount = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(DiscountCode, req.query).filters().sort().limit().paginate().populate()
    const discount = await features.model
    return res.status(200).json({
        status: true,
        data: discount
    })
})

export const getOneDiscount = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const discount = await DiscountCode.findById(id)
    return res.status(200).json({
        status: true,
        data: discount
    })
})

export const createDiscount = catchAsync(async (req, res, next) => {
    const discount = await DiscountCode.create(req.body)
    return res.status(200).json({
        status: true,
        messaeg: "Discount code created...",
        data: discount
    })
})

export const updateDiscount = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const discount = await DiscountCode.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    return res.status(200).json({
        success: true,
        data: { discount },
        message: 'discount code updated...'
    })
});

export const checkDiscount = catchAsync(async (req, res, next) => {
    const { code } = req.body
    const { id } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
    const discount = await DiscountCode.findOne({ code })
    
    const user = await User.findById(id)

    let now = Date.now()

    if (discount.expireTime < now || discount.startTime > now || !discount || user.usedDiscountCode.includes(code)) {
        return next(new HandleError("discount code invalid", 400))
    }

    return res.status(200).json({
        status: true,
        messaeg: "Discount code valid",
        data: discount.discount
    })
})
