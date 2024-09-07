import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullAddress : {
        type : String ,
        required : [true , "fullAddress is required"]
    },
    city : {
        type : String ,
        required : [true , "city is required"]
    },
    postalCode : {
        type : String ,
        required : [true , "postalCode is required"]
    },
    country : {
        type : String ,
        required : [true , "country is required"]
    },
    state : {
        type : String ,
        required : [true , "state is required"]
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    },
    receiverName : {
        type : String ,
        required : [true , "receiverName is required"]
    },
    receiverPhone : {
        type : String ,
        required : [true , "receiverPhone is required"],
        unique : [true , "receiverPhone is duplicate"],
        match : [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g, "phone invalid"]
    },
    plaque : {
        type : String,
        required : [true , "plaque required"]
    },
    lng : {
        type : String
    },
    lat : {
        type : String
    },
    isActive : { 
        type : Boolean ,
        default : true
    }
})

export const Address = mongoose.model("Address" , addressSchema)