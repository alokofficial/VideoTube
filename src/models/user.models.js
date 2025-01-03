import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    refreshToken:{
        type:String
    },
    watchHistory:{
        type:mongoose.Types.ObjectId,
        ref:"Video"
    }

},{timestamps:true})

export const User = mongoose.model("User", userSchema)