import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { dataValidator } from "../utils/dataValidator.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly:true,
    secure:true
}

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User not found while generating tokens");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } 
    catch (error) {
        console.error("generateAccessAndRefreshToken error:", error);
        throw new ApiError(500,"Something went wrong during generating access and refresh token");
    }
};

const registerUser = asyncHandler(async(req,res,next) =>{
    const {name,email,password} = req.body;
    if(!dataValidator(req.body,["name","email","password"])){
        throw new ApiError(400,"Fill all the required fields");
    }
    const userExists = await User.findOne({email});
    if(userExists){
        throw new ApiError(409,"User with same email already exists");
    }
    const userCreated = await User.create({
        name,
        email,
        password
    });
    if(!userCreated){
        throw new ApiError(500,"Something went wrong while creating new user");
    }
    const userObj = userCreated.toObject();
    delete userObj.password;

    return res
    .status(201)
    .json(new ApiResponse(201,userObj,"User created successfully"));
});

const loginUser = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!dataValidator(req.body,["email","password"])){
        throw new ApiError(400,"Fill all the required fields");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User is not found");
    }
    const isCorrectPassword = await user.comparePassword(password);
    if(!isCorrectPassword){
        throw new ApiError(400,"Incorrect password");
    }
    const { accessToken,refreshToken } = await generateAccessAndRefreshToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{userObj,accessToken,refreshToken},"User loggedin successfully"));
});

const logoutUser = asyncHandler(async(req,res,next)=>{
    if(!req.user){
        throw new ApiError(401,"Unauthorized request");
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {refreshToken:undefined},
        {new:true}
    );
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async(req,res,next)=>{
    const incomingRefreshToken = req.cookies.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request");
    }
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.SECRET_REFRESH_TOKEN);
    const user = await User.findById(decodedToken?._id);
    if(!user) throw new ApiError(401,"Invalid refresh token");
    if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401,"Refresh token is used or expired");
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{accessToken,refreshToken:refreshToken},"Tokens are updated successfully"));
});


export {registerUser,loginUser,logoutUser,refreshAccessToken};