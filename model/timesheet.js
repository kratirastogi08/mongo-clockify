const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const timesheetSchema=new mongoose.Schema({
    workDesc:String,
    isBillable:{
        type:Boolean,
        default:true
    },
    workDate:Date,
    workStartTime:Date,
    workEndTime:Date,
    workTimePeriod:Number,
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    isActive:{
        type: Boolean,
        default:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    taskId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }
    ,
    tagIds:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tag" 
        }
    ],    
},{
    timestamps:true,
    versionKey:false,
    collection:"Timesheet"
})

const Timesheet=db.model("Timesheet",timesheetSchema)
module.exports=Timesheet