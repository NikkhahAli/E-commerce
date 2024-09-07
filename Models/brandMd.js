import mongoose from "mongoose";

const brandSchema= new mongoose.Schema({
    name : {
        type : String,
        required : [true , "brand name is required"]
    },
    image : {
        type : String,
    },
    categoryId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }]
   
})
export const Brand = mongoose.model("Brand" , brandSchema)