class ApiError extends Error{ // custom error class by extending error class
    constructor( // constructor which accepts parameters like status code and message 
        statusCode,
        message="Something went wrong",
        error=[],
        stack=" "
    ){
        super(message); // calling the parent class constructor
        this.statusCode=statusCode
        this.data = null
        this.message = message
        this.success = false
        this.error = error
        this.timestamp = new Date().toISOString();
        if(stack && stack.trim()){ // if stack is provided and is not empty 
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor) // capture the stack trace of the error
        }
    }
}

export {ApiError}
