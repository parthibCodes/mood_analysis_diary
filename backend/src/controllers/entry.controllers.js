import { Journal } from "../models/journalEntrySchema.js";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dataValidator } from "../utils/dataValidator.js";

const addEntry = asyncHandler(async(req,res,next)=>{
    const { entry } = req.body;
    if(!dataValidator(entry,"entry")){
        throw new ApiError(400,"Please write something in the diary");
    }
    const userId = req.user._id;
    const newEntry = await Journal.create({
        entry,
        user:userId
    });
    return res
    .status(200)
    .json(new ApiResponse(200,newEntry,"Journal entry created successfully"));
});

const getAllEntries = asyncHandler(async(req,res,next)=>{
    const entries = await Journal.find(req.user._id).sort({timestamp:-1});
    const date = req.params.date;
    if(date){
        const entries = await Journal.find({user:req.user._id,date}).sort({timestamp:-1});
        if(!entries){
            throw new ApiError(404,"No entry exist of the date");
        }
        return res
        .status(200)
        .json(new ApiResponse(200,entries,"All entries are fetched"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,entries,"All entries are fetched"));
});

export {addEntry,getAllEntries};