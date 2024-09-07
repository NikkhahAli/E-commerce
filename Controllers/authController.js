import { catchAsync } from '../Utils/catchAsync.js'
import HandleError from '../Utils/handleError.js'
import { sendAuthCode, verifyCode } from '../Utils/smsHandler.js'
import { User } from './../Models/userMd.js'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

export const auth = catchAsync(async (req, res, next) => {
    const { phone } = req.body
    const user = await User.findOne({phone})

    if (!user || !user.password) {
        await sendAuthCode(phone)
        return res.status(200).json({
            status: true,
            message: "verification code sent successfully",
            isExist: user ? true : false
        })
    }
    else {
        return res.status(200).json({
            status: true,
            isExist: true
        })
    }
})

export const loginWithPassword = catchAsync(async (req, res, next) => {
    const { phone, password } = req.body
    const user = await User.findOne({ phone })

    if (!bcrypt.compare(password, user.password)) {
        return next(new HandleError("password is not correct", 400))
    }
    const token = jwt.sign({id: user._id, phone: user.phone, role: user.role}, process.env.JWT_SECRET)

    return res.status(200).json({
        status: true,
        data: {
            token,
            role: user.role,
            phone: user.phone,
            cart: user.cart,
            isComplete: user.isComplete,
        },
        message: "login successfully"
    })
})

export const sendCode = catchAsync(async (req, res, next) => {
    const { phone } = req.body
    sendAuthCode(phone)
    return res.status(200).json({
        status: true,
        message: "verification code sent successfully",
    })
})

export const checkOtp = catchAsync(async (req, res, next) => {
    const { phone, code } = req.body
    const smsResult = await verifyCode(phone, code)
    let user = await User.findOne({ phone })

    if (!smsResult.success) {
        return next(new HandleError("verification code is wrong", 400))
    }

    if (!user) {
        user = await User.create({ phone })
    }

    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET)

    return res.status(200).json({
        status: true,
        data: {
            token,
            role: user.role,
            phone: user.phone,
            cart: user.cart,
            isComplete: user.isComplete,
        },
        message: "login successfully"
    })
})

export const forgetPassword = catchAsync(async (req, res, next) => {
    const { phone } = req.body

    const user = await User.findOne({ phone })

    if (!user) {
        return next(new HandleError("not found user with this phone", 404))
    }
    else {

        await sendAuthCode(phone)
        return res.status(200).json({
            status: true,
            message: "verification code sent successfully",
        })
    }
})

export const checkOtpForgetPassword = catchAsync(async (req, res, next) => {
    const { phone, code } = req.body
    const user = await User.findOne({ phone })

    if (!user) {
        return next(new HandleError("not found user with this phone", 404))
    }
    else {
        const smsResult = await verifyCode(phone, code)

        if (!smsResult.success) {
            return next(new HandleError("verification code is wrong", 400))
        }
        const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role, changePassword: true }, process.env.JWT_SECRET)

        return res.status(200).json({
            status: true,
            data: {
                token,
            },
            message: "verification code is ok"
        })
    }
})

export const changePassword = catchAsync(async (req, res, next) => {
    try {
        const { password } = req.body
        const { id, changePassword } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET)
        const user = await User.findById(id)
        if (!user) {
            return next(new HandleError("not found user with this phone", 404))
        }
        else if (!changePassword) {
            return next(new HandleError("authorization hasn't done", 401))
        }

        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g

        if (!regex.test(password)) {
            return next(new HandleError("password must be a small and capital letter", 401))
        }
        const newPassword = bcrypt.hash(password , 12)
        const newUser= await User.findByIdAndUpdate(id , {password:newPassword},{new:true,runValidators:true})
        const token = jwt.sign({id : user._id , phone : user.phone , role : user.role} ,process.env.JWT_SECRET)
        
        return res.status(200).json({
            status: true,
            token,
            data: {
                role: newUser.role,
                phone: newUser.phone,
                cart: newUser.cart,
                isComplete: newUser.isComplete,
            },
            message: "login successfully"
        })
    }
    catch (error) {
        return next(new HandleError("authorization hasn't done", 401))
    }
})

