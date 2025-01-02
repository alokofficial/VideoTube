// main file to be run 
import dotenv from "dotenv" // to use environment variables
import connectDB from "./db/index.js" // import Database connectivity

dotenv.config({path:".env"}) // set the environment file path from where have to pick variables
connectDB() // established database connectivity