import { ApiError, asyncHandler } from "../utils/index.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const VerifyJWT = asyncHandler(async (req,res,next)=>{
    // This middleware checks if the user is logged in or not
    // if the user is not logged in, it throws an error
    // if the user is logged in, it checks if the user exists or not
    // if the user does not exist, it throws an error
    // if the user exists, it checks if the user is verified or not
    // if the user is not verified, it throws an error
    // if the user is verified, it calls the next middleware
    // if the user is not verified, it throws an error 

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"You are not logged in !!")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"You are not logged in !!")
        }
        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401,error?.message ||"Invalid access token !!")
    }
})