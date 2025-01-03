import mongoose from "mongoose"

const videoSchema =  new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    videoFile:{
        type:String,
    },
    thumbnail:{
        type:String,
    },
    duration:{
        type:Number
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const Video = mongoose.model("Video",videoSchema)