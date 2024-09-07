import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({ // سبد خرید 
    totalPrice: {
        type: Number,
        default: 0,
        min: 0,
        
    },
    item: {
        type: [
            {
                categoryId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CategoryId",
                },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                productVariantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductVariant",
                    required: true
                }
            }
        ],
        default: []
    }
})

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    nationalCode: {
        type: String,
        match: [/^[0-9]{10}$/g, "nationalCode invalid"]
    },
    email: {
        type: String,
        match: [/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g, "email invalid"]
    },
    phone: {
        type: String,
        required: [true, "fullName is required"],
        unique: true,
        match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g, "phone invalid"]
    },
    password: {
        type: String
    },
    recentlyProduct: {
        type : [{
            type: mongoose.Schema.Types.ObjectId ,
            ref : "Product"
        }]
    },
    usedDiscountCode: {
        type: Array,
        default: []
    },
    favoriteProduct: {

    },
    isActive: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        default: []
    },
    isComplete: {
        type: Boolean,
        deafult : false
    },
    role : {
        type : String ,
        enum : ["admin" , "user" , "superAdmin"],
        default : "user"
    },
    cart : cartSchema,
    boughtProductId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Product"
    },
    
},{timestamps:true})

export const User = mongoose.model("User", userSchema)