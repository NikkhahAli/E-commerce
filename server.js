import dotenv from "dotenv"
import { app } from "./app.js"
import mongoose from "mongoose"

dotenv.config({path : "./config.env"})

try {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log("db connected succssfully")
}
catch(error) {
    console.log("something went wrong")
}

const port = process.env.PORT || 8000
app.listen(port , () =>console.log(`server is running on port ${port}`))