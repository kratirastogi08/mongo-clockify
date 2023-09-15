const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const clientSchema=new mongoose.Schema({
    clientName:String,
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    },
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
    collection:"Client"
})

const Client=db.model("Client",clientSchema)
module.exports=Client