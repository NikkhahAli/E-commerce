import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Enter content is required"], 
        trim: true,
        minlength: 5
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    isPublish: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    isCustomer : {
        type : Boolean,
        default : false
    }
})

export const Comment = mongoose.model("Comment", commentSchema)