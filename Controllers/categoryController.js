import jwt from "jsonwebtoken"
import { catchAsync } from "../Utils/catchAsync.js";
import { ApiFeatures } from './../Utils/apiFeatures.js';
import { Category } from "../Models/categoryMd.js";
import  fs from 'fs';
import {__dirname} from "../app.js"
import { Product } from "../Models/productMd.js";

export const getAllCategory = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Category, req.query).filters().sort().limit().paginate().populate()
    const categories = await features.model
    return res.status(200).json({
        status: true,
        data: categories
    })
})
export const getCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const categories =await Category.findById(id)
    return res.status(200).json({
        status: true,
        data: categories
    }) 
})

export const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const {image = '' , ...others } = req.body
    const categories = await Category.findById(id)

    if (image && image !== categories.image) {
        fs.unlinkSync(`${__dirname}/Public/${categories.image}`)
    }
    
    const updateData =  image ? req.body : others
    const newCategories = await Category.findByIdAndUpdate(id , updateData ,{new:true,runValidators:true})
    return res.status(200).json({
        status: true,
        message : "category updated..." ,
        data: newCategories
    }) 
})

export const createCategory = catchAsync(async (req, res, next) => {
    const categories = await Category.create(req.body)
    return res.status(200).json({
        status: true,
        message : "category created..." ,
        data: categories
    }) 
})

export const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const categories = await Category.findByIdAndDelete(id)
    
    fs.unlinkSync(`${__dirname}/Public/${categories.image}`)

    await Product.updateMany({categoryId : id} , {$set : {categoryId : ''}})
    return res.status(200).json({
        status: true,
        message : "category deleted..." ,
        data: categories
    }) 
})