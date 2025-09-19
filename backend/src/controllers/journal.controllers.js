import { Journal } from "../models/journalEntrySchema.js";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { dataValidator } from "../utils/dataValidator.js";

const addEntry = asyncHandler(async(req,res,next)=>{
    const { entry } = req.body;
    if(!dataValidator(req.body,["entry"])){
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
    let query = {user:req.user._id};
    const date = req.params.date;
    if(date){
        const [year,month,day] = date.split("-");
        const startDay = new Date(year,month-1,day,0,0,0,0);
        const endDay = new Date(year,month-1,day,23,59,59,999);
        query.date = {$gte:startDay,$lte:endDay};
    }
    const entries = await Journal.find(query).sort({date:-1});

    return res
    .status(200)
    .json(new ApiResponse(200,entries,entries.length > 0 ?"All entries are fetched" : "No entries found"));
});

const editEntries = asyncHandler(async(req,res,next)=>{
    const userId = req.user._id;
    const {entry} = req.body;
    const { journalId } = req.params;
    if(!entry){
        throw new ApiError(400,"Entry text is required");
    }
    const editedEntry = await Journal.findOneAndUpdate({_id:journalId,user:userId},{entry},{new:true});
    if(!editedEntry){
        throw new ApiError(404,"Entry not found or not authorized");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,editedEntry,"Entry has been updated"));
});

const deleteEntries = asyncHandler(async(req,res,next)=>{
    const { journalId } = req.params;
    const userId = req.user._id;
    if(!journalId){
        throw new ApiError(404,"Journal doesn't exist");
    }
    const deletedEntry = await Journal.findOneAndDelete({_id:journalId,user:userId});
    if (!deletedEntry) {
        throw new ApiError(404, "Entry not found or not authorized");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Journal deleted successfully"));
});

export {addEntry,getAllEntries,editEntries,deleteEntries};