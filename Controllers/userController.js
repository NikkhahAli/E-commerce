import { User } from "../Models/userMd.js"
import jwt from "jsonwebtoken"
import { catchAsync } from "../Utils/catchAsync.js";
import { ApiFeatures } from './../Utils/apiFeatures.js';

export const getAllUser = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(User, req.query).filters().sort().limit().paginate().populate()
    const user = await features.model
    return res.status(200).json({
        status: true,
        data: user
    })
})
export const getOneUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { role, id: userId } = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)

    if (role == "admin" || role == "superAdmin" || userId == id) {
        const users = await User.findById(id).select("-password -__v")

        return res.status(200).json({
            status: true,
            data: users
        })
    }
    else {
        return next(new HandleError("you don't have access", 401))
    }
})

export const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { role: tokenRole, id: userId } = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)

    if (tokenRole == "superAdmin") {
        const users = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).select("-password -__v -usedDiscountCode")

        return res.status(200).json({
            status: true,
            message: "user updated...",
            data: users
        })
    }
    else if (tokenRole == "admin" || id == userId) {
        const {usedDiscountCode ='', role = '', password = '' , cart, ...others } = req.body

        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g

        if (password && !regex.test(password)) {
            return next(new HandleError("password must be a small and capital letter", 401))
        }

        else if (password) {
            const newPassword = bcrypt.hash(password, 12)

            const users = await User.findByIdAndUpdate(id, { password: newPassword, ...others }, { new: true, runValidators: true }).select("-password -__v")
            return res.status(200).json({
                status: true,
                message: "user updated...",
                data: users
            })
        }

        const users = await User.findByIdAndUpdate(id, others, { new: true, runValidators: true }).select("-password -__v")
        return res.status(200).json({
            status: true,
            message: "user updated...",
            data: users
        })
    }
    else {
        return next(new HandleError("you don't have access", 401))
    }
})