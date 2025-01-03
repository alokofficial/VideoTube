import {asyncHandler, ApiError, ApiResponse, uploadOnCloudinary} from "../utils/index.js"
import { User } from "../models/user.models.js"
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

export {
    registerUser
}