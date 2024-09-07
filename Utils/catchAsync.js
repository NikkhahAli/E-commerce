export const catchAsync = (fn) =>{
    return (req , res , next) =>{
        fn(req , res , next).catch(next) // اکه ارور داشته باشه با استفاده از نکست میده به میدلور بعدی
    }
}

/// این فایل کار try catch رو میکنه

// export default catchAsync