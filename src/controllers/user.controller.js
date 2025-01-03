import {asyncHandler, ApiError, ApiResponse, uploadOnCloudinary} from "../utils/index.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
const registerUser = asyncHandler(async (req, res)=>{
    // take user data from the request body
    // validate the user data 
    // check if user already exists {username,email}
    // check for avatar
    // upload the avatar on cloudinary
    // create user object and save it to the database
    // send the response to the client by removing the password and refreshToken from the user object
    // check for user creation
    // response returns the user object

    const {fullName,email,password,username}=req.body;
    if(
        [fullName,email,password,username].some((value)=>value?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required !!")
    }
    const existingUser = await User.findOne({
        $or:[{email:email},{username:username}]
    })
    if(existingUser){
        throw new ApiError(409,"User already exists !!")
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required !!")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Failed to upload avatar on Cloudinary!!")
    }
    const user = await User.create({
        fullName,
        email,
        password,
        username:username.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
    })
    const createdUser =  await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Failed to create user !!")
    }
    return res.
    status(201).
    json(new ApiResponse(
        200,createdUser, "User created successfully !!"
    ))
})

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user?.generateAccessToken()
        const refreshToken = user?.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Failed to generate access and refresh token !!")
    }
}

const loginUser = asyncHandler(async (req, res)=>{
    // take user data from the request body
    // validate the user data 
    // check if user exists {email}
    // check if password is correct
    // generate access and refresh token
    // send the response to the client by removing the password and refreshToken from the user object
    // check for user login
    // response returns the user object

    const {email,password} = req.body;
    if(!email){
        throw new ApiError(400,"Email or Username is required !!")
    }
    const user = await User.findOne({
        email
    })
    if(!user){
        throw new ApiError(404,"User not found !!")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password !!")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const option = {
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(new ApiResponse(200,loggedInUser,"User logged in successfully !!"))

})
const logoutUser = asyncHandler(async (req, res)=>{
    // we need middleware to check if the user is logged in or not
    // clear the cookies
    // send the response to the client
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const option = {
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,null,"User logged out successfully !!"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    //check the refresh token is present or not
    // check if the refresh token is valid or not
    // generate a new access token
    // send the response to the client
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken){
            throw new ApiError(401, "Unauthorized !!")
        }
        const decodedRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        if(!decodedRefreshToken){
            throw new ApiError(401, "Invalid refresh token !!")
        }
        const user = await User.findById(decodedRefreshToken._id);
        if(!user){
            throw new ApiError(401, "user not found with refresh token !!")
        }
        if(user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "Invalid refresh token !!")
        }
        const option = {
            httpOnly:true,
            secure:true,
        }
        const {accessToken,refreshToken:newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",newRefreshToken,option)
        .json(new ApiResponse(200,null,"Access token refreshed successfully !!"))
    } catch (error) {
        throw new ApiError(500,error?.message || "Failed to generate refresh and access token !!")

    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,

}