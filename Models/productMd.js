import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: 8
    }, 
    description: {
        type: String,
        required: [true, "description is required"],
        trim: true,
    },
    infromation: {
        type: [
            {
                name: String,
                value: String,
            }
        ],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    defaultVariant: {
            type : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductVariant"
            }
        ],
        default : []
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
    },
    rating: {
        avgRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        RateCount: {
            type: Number,
            default: 0,
        }
    },
    productVariantId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariant"
        }
    ],
    isActive : {
        type : Boolean ,
        default : true
    },
    averageRate : {
        type : Number ,
        default : 0
    },
    rateCount : {
        type : Number ,
        default : 0
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)