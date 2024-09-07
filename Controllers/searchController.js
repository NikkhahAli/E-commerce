import { Brand } from './../Models/brandMd.js'
import { Category } from './../Models/categoryMd.js'
import { Product } from './../Models/productMd.js'
import { catchAsync } from './../Utils/catchAsync.js'

export const search = catchAsync(async (req, res, next) => {
    const { query } = req.body
    const brand = await Brand.find({ name: { $regex: query, option: "i" } })
    const product = await Product.find({ name: { $regex: query, option: "i" } })
    const category = await Category.find({ name: { $regex: query, option: "i" } })
    
    if (product.length == 0 && category.length == 0 && brand.length == 0) {
        return res.status(200).json({
            message: "result not found",
            data: null
        })
    }
    return res.status(200).json({
        data: {
            product,
            category,
            brand
        }
    })
})