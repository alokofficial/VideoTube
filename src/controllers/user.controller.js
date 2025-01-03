import {asyncHandler, ApiError, ApiResponse, uploadOnCloudinary} from "../utils/index.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import fs from "fs"
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

const changeCurrentPassword = asyncHandler(async (req, res)=>{
    // req.body ==> data from the request body
    // check if the user is logged in or not
    // check if the current password is correct or not
    // check if the new password is valid
    // update the password
    // send the response to the client

    const {currentPassword,newPassword} = req.body;
    if(!currentPassword){
        throw new ApiError(400,"Current password is required !!")
    }
    if(!newPassword){
        throw new ApiError(400,"New password is required !!")
    }
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user?.isPasswordCorrect(currentPassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid current password !!")
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,null,"Password changed successfully !!"))
})

const getCurrentUser = asyncHandler(async (req, res)=>{
    // check if the user is logged in or not
    // send the response to the client
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"Current user fetched successfully !!"))
})

const updateAccountDetails = asyncHandler(async (req, res)=>{
    const {fullName,email} = req.body;

    if(!(fullName || email)){
        throw new ApiError(400,"FullName or Email is required !!")
    }
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                fullName:fullName,
                email:email
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully !!"))
})

const updateUserAvatar = asyncHandler(async (req, res)=>{
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required !!")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        fs.unlikedSync(avatarLocalPath);
        throw new ApiError(500,"Failed to upload avatar !!")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken")
    if(!user){
        throw new ApiError(400,"User not Found !!")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully !!"))
})

const updateUserCoverImage = asyncHandler(async (req, res)=>{
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image is required !!")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
        fs.unlikedSync(coverImageLocalPath);
        throw new ApiError(500,"Failed to upload avatar !!")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken")
    if(!user){
        throw new ApiError(400,"User not Found !!")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Cover image updated successfully !!"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage



}