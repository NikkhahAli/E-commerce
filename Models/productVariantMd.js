import mongoose from "mongoose"

const productVariantSchema = new mongoose.Schema({
    variant: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Variant"
    },
    image : {
        type : String ,
    },
    price : {
        type : Number ,
        required : [true , "price is required"]
    },
    discount :{
        type : Number ,
        default : 0 ,
        min : 0,
        max : 100
    },
    quantity : {
        type : Number ,
        required : [true , "quantity is required"]
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Product"
    },
    finalPrice : {
        type : Number ,
    }
})
export const ProductVariant = mongoose.model("ProductVariant" , productVariantSchema)