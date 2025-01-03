const asyncHandler = (requestHandler)=>{ 
    // This function takes a requestHandler as an argument, 
    // and returns a new function which will call the requestHandler 
    // with the same arguments, but will catch any errors that occur 
    // and pass them to the next middleware function in the chain.
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))
    }
}

export {asyncHandler}
