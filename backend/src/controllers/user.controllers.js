import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { dataValidator } from "../utils/dataValidator.js";


const options = {
    httpOnly:true,
    secure:true
}

const generateAccessAndRefreshToken = asyncHandler(async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong during generating access and refresh token");
    }
});

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
    const { accessToken,refreshToken } = generateAccessAndRefreshToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{userObj,accessToken,refreshToken},"User loggedin successfully"));
});

const logoutUser = asyncHandler(async(req,res,next)=>{
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


export {registerUser,loginUser,logoutUser};