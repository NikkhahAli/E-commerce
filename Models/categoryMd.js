import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name : {type : String , required : [true , "name is required"]},
    image : {type : String , required : [true , "image is required"]},
    SubCategory : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Category"
    },
    // brands : [{
    //     type : mongoose.Schema.Types.ObjectId , 
    //     ref : "Brand"
    // }]
},{timestamps:true})

export const Category = mongoose.model("Category" , categorySchema)