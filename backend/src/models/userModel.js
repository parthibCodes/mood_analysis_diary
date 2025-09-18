import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose,{model, Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message:"Invalid username format",
    },
    password:{
        type:String,
        required:true,

    },
    refreshToken:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
},{timestamps:true});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
    },process.env.SECRET_ACCESS_TOKEN,{expiresIn:"15m"});
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id
    },process.env.SECRET_REFRESH_TOKEN,{expiresIn:"7d"});
}

export const User = model("User",userSchema);