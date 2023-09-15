const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const taskSchema=new mongoose.Schema({
    taskName:String,
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    },
    projectId:{
       type: mongoose.Schema.Types.ObjectId ,
       ref:"Project"
    },
    access:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }],
    isActive:{
      type:Boolean,
      default:true
    },
    isDelete:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false,
    collection:"Task"
})

const Task=db.model("Task",taskSchema)
module.exports=Task