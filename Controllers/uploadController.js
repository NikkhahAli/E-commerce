import fs from "node:fs"
import { __dirname } from "../app.js"
import { catchAsync } from './../Utils/catchAsync.js'
import HandleError from "../Utils/handleError.js"

export const uploadFile = catchAsync (async (req , res , next) => {
    const file = req.file
    !file && next(new HandleError("send the file is required" , 400))
    return res.status(200).json({
        status : true ,
        message : "file uploaded successfully" ,
        data : file
    })  
})

export const deleteFile = catchAsync (async (req , res , next) => {
    const {fileName} = req.body
    const deleteFileName = fileName.split('/').at(-1)

    if (deleteFileName == "*") {
        return next(new HandleError("file not found" , 400))
    }

    !fileName && next(new HandleError("file not found" , 400))

    fs.unlinkSync(`${__dirname}/Public/${deleteFileName}`)

    return res.status(200).json({
        status : true ,
        message : "file deleted successfully" ,
    }) 
})