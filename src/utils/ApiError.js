class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack=" "
    ){
        super(message);
        this.statusCode=statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = error
        this.timestamp = new Date().toISOString();
        if(stack && stack.trim()){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}