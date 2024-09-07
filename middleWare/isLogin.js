import { catchAsync } from "../Utils/catchAsync.js"
import jwt from "jsonwebtoken"
import HandleError from './../Utils/handleError.js'

export const isLogin = catchAsync(async (req, res, next) => {
    const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    !token ? next(new HandleError("You're not login", 401)) : next()
})