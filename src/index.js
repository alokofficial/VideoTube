// main file to be run ( setup the env configuration and databases )
import dotenv from "dotenv" // to use environment variables
import connectDB from "./db/index.js" // import Database connectivity
import {app} from "./app.js"

dotenv.config({path:".env"}) // set the environment file path from where have to pick variables
connectDB() // established database connectivity
.then(()=>{ //return promise if resolve
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is started on ${process.env.PORT?process.env.PORT:8000}`)
    })
})
.catch((error)=>{ 
    console.log("mongoDB connection failed", error.message)
})
 