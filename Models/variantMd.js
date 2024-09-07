import mongoose from "mongoose"

const variantSchema = new mongoose.Schema({
    type : {
        type : String ,
        enum : ["color" , "size"] 
    },
    value : {
        type : String ,
        required : [true , "variant value is required"]
    }
})
export const Variant = mongoose.model("Variant" , variantSchema)