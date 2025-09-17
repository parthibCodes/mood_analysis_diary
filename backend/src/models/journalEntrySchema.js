import mongoose,{Schema,model} from "mongoose";
import { User } from "./userModel.js";

const journalSchema = new Schema({
    entry:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    date:{
        type:Date,
        default:()=>{
            const now = new Date();
            return new Date(now.getFullYear(),now.getMonth(),now.getDate());
        }
    },
    
},{timestamps:true});

export const Journal = new model('Journal',journalSchema);