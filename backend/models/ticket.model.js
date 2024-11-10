import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    lastLogin:{
        type:Date,
        default:Date.now,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

export const User = mongoose.model('User',userSchema);