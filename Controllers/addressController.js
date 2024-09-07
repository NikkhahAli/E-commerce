import { Address } from './../Models/addressMd.js'
import jwt from "jsonwebtoken"
import { catchAsync } from './../Utils/catchAsync.js'
import { ApiFeatures } from './../Utils/apiFeatures.js'
import HandleError from './../Utils/handleError.js'

export const getAllAddress = catchAsync(async (req, res, next) => {
    const { role, id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    let queryString = { ...req.query }

    if (role !== "Admin" && role !== "superAdmin") {
        queryString = { ...req.query, filters: { ...req.query.filters, userId: id } }
    }

    const features = new ApiFeatures(Address, queryString).filters().sort().limit().paginate().populate()
    const address = await features.model
    return res.status(200).json({
        status: true,
        data: address
    })
})

export const getAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { role, id: tokenId } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const address = await Address.findById(id)

    if (role !== "admin" && role !== "superAdmin" && id !== tokenId) {
        return next(new HandleError("You cannot access to this address", 401))
    }
    return res.status(200).json({
        status: true,
        data: address
    })
})

export const updateAddress = catchAsync(async (req, res, next) => {
    const { id : addressId} = req.params
    const { role, id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const {userId , ...others} =req.body

    if (role !== "admin" && role !== "superAdmin" && id !== userId) {
        return next(new HandleError("You cannot access to this address", 401))
    }
    const address = await Address.findByIdAndUpdate(addressId , {...others}, { new: true, runValidators: true })

    return res.status(200).json({
        status: true,
        message: "address updated...",
        data: address
    })
})

export const createAddress = catchAsync(async (req, res, next) => {
    const {id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const address = await Address.create({...req.body , userId : id })
    return res.status(200).json({
        status: true,
        message: "address created...",
        data: address
    })
})  

export const deActiveAddress = catchAsync(async (req, res, next) => {
    const {id : addressId} = req.params
    const {id } = jwt.verify(req.headers.auhtorization.split(" ")[1], process.env.JWT_SECRET)
    const {userId} = req.body

    if (role !== "admin" && role !== "superAdmin" && id !== userId) {
        return next(new HandleError("You cannot access to this address" ,401))
    }   

    const address = await Address.findByIdAndUpdate(addressId , {isActive:false})

    return res.status(200).json({
        status: true,
        message: "address deleted...",
        data: address
    })
})  