import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2" // 3rd party plugin

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

videoSchema.plugin(mongooseAggregatePaginate) // plugin for pagination 

export const Video = mongoose.model("Video",videoSchema)