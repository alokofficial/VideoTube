import mongoose from "mongoose" // import mongoose ODM

import { DB_NAME } from "../constant.js" // Database name from constant file

const connectDB = async ()=>{ // database connectivity is async task
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connected to:-${connectionInstance.connection.host}`) //to get the host name printed
    } catch (error) {
        console.log("Failed to connect ",error.message)
        process.exit(1); // programe to be exit is cause some issue
    }
}
export default connectDB; // default export the database connectivity 