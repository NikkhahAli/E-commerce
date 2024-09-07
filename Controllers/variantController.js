import { Variant } from "../Models/variantMd.js"
import { ApiFeatures } from "../Utils/apiFeatures.js"
import { catchAsync } from "../Utils/catchAsync.js"

export const getAllVariant = catchAsync (async (req , res ,next) => {
    const features = new ApiFeatures(Variant , req.query).filters().sort().limit().paginate().populate()
    const variant = await features.model 
    return res.status(200).json({
        status : true ,
        data : variant
    })
})

export const getVariant = catchAsync (async (req,res,next) => {
    const {id}=req.params
    const  variant = await Variant.findById(id)
    return res.status(200).json({
        status : true ,
        data : variant
    })
})

export const updateVariant = catchAsync (async (req,res,next) => {
    const {id} = req.params
    const variant = await Variant.findByIdAndUpdate(id , req.body , {new:true,runValidators:true})
    return res.status(200).json({
        status : true ,
        message : "variant updated..." ,
        data : variant
    })
})

export const createVariant = catchAsync (async (req,res,next) => {
    const variant = await Variant.create(req.body)

    return res.status(200).json({
        status : true ,
        message : "variant created..." ,
        data : variant
    })
})