import express from "express"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import { catchError } from "./Utils/catchError.js"

export const app = express()

const filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(filename)

import { authRouter } from "./Routes/auth.js"
import { cartRouter } from "./Routes/cart.js"
import { categoryRouter } from "./Routes/category.js"
import { commentRouter } from "./Routes/comment.js"
import { orderHistoryRouter } from "./Routes/orderHistory.js"
import { productRouter } from "./Routes/product.js"
import { sliderRouter } from "./Routes/slider.js"
import { userRouter } from "./Routes/user.js"
import { variantRouter } from "./Routes/variant.js"
import { uploadRouter } from "./Routes/upload.js"
import { addressRouter } from "./Routes/address.js"
import { discountCodeRouter } from "./Routes/discountCode.js"
import { brandRouter } from "./Routes/brand.js"
import { productVariantRouter } from "./Routes/productVariant.js"
import { checkOrder } from "./Controllers/orderHistoryController.js"
import { reportRouter } from "./Routes/report.js"
import { searchRouter } from './Routes/search.js';

app.use(express.static("Public"))
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

setInterval(checkOrder , 900000)
    
app.use("/api/address", addressRouter)
app.use("/api/auth", authRouter)
app.use("/api/brand", brandRouter)
app.use("/api/cart", cartRouter)
app.use("/api/category", categoryRouter)
app.use("/api/comment", commentRouter)
app.use("/api/discountCode", discountCodeRouter)
app.use("/api/orderHistory", orderHistoryRouter)
app.use("/api/product", productRouter)
app.use("/api/productRouter", productVariantRouter)
app.use("/api/report", reportRouter)
app.use("/api/slider", sliderRouter)
app.use("/api/search", searchRouter)
app.use("/api/upload", uploadRouter)
app.use("/api/user", userRouter)
app.use("/api/variant", variantRouter)

app.use("*", (req, res, next) => {
    return res.status(404).json({
        status: "failed",
        message: `Router not found ${req.originalUrl}`
    })
})

app.use(catchError)