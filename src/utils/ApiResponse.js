class ApiResponse {
    constructor(statusCode, data, message=null,error=null){
        this.statusCode = statusCode
        this.data = data
        this.message = message || (statusCode < 400 ? "Success" : "Error")
        this.error = error
        this.success = statusCode < 400
        this.timestamp = new Date().toISOString();

    }
}

export {ApiResponse}