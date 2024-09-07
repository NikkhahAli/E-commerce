export const catchError = (err , req , res , next) =>{ // تمام ارور هایی که زده بشه میاد اینجا

    err.statusCode = err.statusCode || 500
    
    err.status = err.status || "error"

    return res.status(err.statusCode).json({
        status : err.status,
        message : err.message
    })
}

