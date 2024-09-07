import { Router } from "express"
import { deleteFile, uploadFile } from "../Controllers/uploadController.js"
import { upload } from './../Utils/UploadFile.js'
import { isAdmin } from './../middleWare/isAdmin.js'

export const uploadRouter = Router()

uploadRouter.route("/")
.post(upload.single("file") , uploadFile)
.delete(isAdmin  , deleteFile)