import mongoose from "mongoose"

const discountCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Discount code is required"],
        unique : true
    },
    startTime: {
        type: String,
        required: [true, "startTime is required"]
    },
    expireTime: {
        type : String ,
        required : [true , "expireTime is required"]
    },
    discount : {
        min : 0 ,
        max : 100 ,
        type : Number , 
        required :[true , "Dicount code is required"]
    },
    minOrder : {
        type : Number ,
        default : 0 
    },
    freeShipping : { // ارسال رایگان
        type : Boolean ,
        default : false
    },
    isActive : { // for deactive code 
        type : Boolean ,
        default : true
    }
},{timestamps:true})
export const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema)