const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const projectSchema=new mongoose.Schema({
    projectName:String,
    access:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isBillable:{
        type:Boolean,
        default:false
    },
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    },
    clientId:{
       type: mongoose.Schema.Types.ObjectId ,
       ref:"Client"
    },
    taskIds:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }
    ],
    isActive:{
      type:Boolean,
      default:true
    },
    hourlyRate:{
      type:Number,
      default:0
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    isPublic:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    collection:"Project"
})

const Project=db.model("Project",projectSchema)
module.exports=Project