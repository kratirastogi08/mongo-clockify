const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const groupSchema=new mongoose.Schema({
    groupName:String,
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    },
    members:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Users"
    }],
    isDelete:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false,
    collection:"Group"
})

const Group=db.model("Group",groupSchema)
module.exports=Group