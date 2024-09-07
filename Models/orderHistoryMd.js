import mongoose from "mongoose"

const orderHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    },
    totalPrice: {
        type: Number,
        required: [true, "total price is required"]
    },
    items: {
        type: Array,
        required: [true, "items is required"]
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    discountCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscountCode"
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    authority: {
        type: String,
        required: [true, "authority is required"]
    }
}, { timestamps: true })
export const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema)