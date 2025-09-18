import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";

const userAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        throw new ApiError(401,"Unauthorized request");
    }
    const verifyWT = jwt.verify(token,process.env.SECRET_ACCESS_TOKEN);
    if(!verifyWT){
        throw new ApiError(401,"Unauthorized request");
    }
    const user = await User.findById(verifyWT._id);
    if(!user){
        throw new ApiError(404,"Invalid access token");
    }
    req.user = user;
    next();
});

export { userAuth };