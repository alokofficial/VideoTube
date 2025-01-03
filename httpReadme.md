## Headers are of four types 
1. request header -- > from client
2. response header --> from server
3. representation header --> encoding/compression
4. payload header --> data 

## Most common headers
* Accept : application/json
* Content-Type
* User-agent // by which engine request is made like postman
* Authorization
* Cookies
* Cache-Control // like expires in

## CORS {Cross-Origin Resource Sharing}
* Access-Control-Allow-Origin
* Access-Control-Allow-Credentials
* Access-Control-Allow-Method

## Security
* Content-Security-Policy
* Cross-Origin-Opener-Policy
* Cross-Origin-Embedder-Policy
* x-xss-protection

## HTTP Methods
* GET -> read a response
* POST -> create a response
* PUT -> update
* DELETE -> delete
* PATCH -> partial update
* OPTIONS -> what operations are available
* HEAD -> no message body in response(response header only)
* TRACE -> trace the request
* CONNECT -> connect to another server

## HTTP Status Code
### 1xx Informational
* 100 -> continue //important
* 101 -> switching protocols
* 102 -> processing //important
* 103 -> early hints

### 2xx Success
* 200 -> success //important
* 201 -> created //important
* 202 -> accepted //important
* 204 -> no content
* 206 -> partial content

### 3xx Redirection
* 300 -> multiple choices
* 301 -> moved permanently //important
* 302 -> found
* 303 -> see other
* 304 -> not modified
* 307 -> temporary redirect //important
* 308 -> permanent redirect //important

### 4xx Client Error
* 400 -> bad request //important
* 401 -> unauthorized //important
* 402 -> payment required //important
* 403 -> forbidden //important
* 404 -> not found //important
* 405 -> method not allowed
* 406 -> not acceptable
* 409 -> conflict
* 410 -> gone
* 422 -> unprocessable entity

### 5xx Server Error
* 500 -> internal server error //important
* 501 -> not implemented
* 503 -> service unavailable //important
* 504 -> gateway timeout //important
* 505 -> http version not supported
* 507 -> insufficient storage
* 509 -> bandwidth limit exceeded
* 511 -> network authentication required
* 520 -> origin failure
* 522 -> connection timed out
* 524 -> a timeout occurred
* 599 -> connection timed out
