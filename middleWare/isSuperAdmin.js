import { catchAsync } from "../Utils/catchAsync.js"
import jwt from "jsonwebtoken"
import HandleError from '../Utils/handleError.js';

export const isSuperAdmin = catchAsync(async (req, res, next) => {
    const { role } = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    role !== "superAdmin" ? next(new HandleError("You're not admin", 401)) : next()
})