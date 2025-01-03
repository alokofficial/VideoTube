import mongoose from "mongoose";
import jwt from "jsonwebtoken" // 3rd party authentication using jwt
import bcrypt from "bcrypt" //3rd party password hashing

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
    watchHistory:[  //array of objects
        {
            type:mongoose.Types.ObjectId,
            ref:"Video"
        }
    ]

},{timestamps:true})

userSchema.pre("save", async function(next){ // pre hook is called before saving the document and keep in mind these are the middlewares so always call next and avoid the arrow function because it will not work, not have contex for this.
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10) // hashing the password with 10 rounds of hashing
    next() // call next to move to the next middleware
    
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password) // compare the password with the hashed password
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({ // jwt.sign requires an object then the secret key and options for exipiry
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
        },
            process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
)}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        },
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)