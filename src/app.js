import cors from "cors" 
import cookieParser from "cookie-parser" 
import express from "express" // import express to make node http server

const app = express()  // initializes an express application instance

app.use(cors({
    origin:process.env.CORS_ORIGIN, // set the origin from where we should allow request
    credentials:true // Allows credentials (cookies, HTTP authentication)
}))
app.use(express.json({ //parses incoming requests with 'Content-Type: application/json'
    limit: "16kb" //Restricts the size of incoming JSON payloads to 16 kilobytes. This helps prevent DoS (Denial of Service) attacks by rejecting large payloads.
}))
app.use(express.urlencoded({ //parses incoming requests with Content-Type: application/x-www-form-urlencoded.
    extended:true, //Allows parsing of nested objects and rich objects using the qs library.|| If set to false, the querystring library is used, allowing only simple key-value pairs (no nesting).
    limit:"16kb"
}))
app.use(express.static("public")) //serves static files from the specified directory (public).
app.use(cookieParser()); // used to parse the cookies attach to the client request object

export {app}