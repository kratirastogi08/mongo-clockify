const db=require("../config/database").getDB()
const mongoose=require("mongoose")

const workspaceSchema=new mongoose.Schema({
   workspaceName:{
    type:String,
    get(value){
        console.log(value)
        return value+"'s workspace"
    }
   },
   userIds:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }],
   createdAt:{
    type:Date,
    default:new Date()
   },
   emailId:{
    type:String,
    lowercase:true,
   }
},{
    timestamps:false,
    versionKey:false,
    collection:"Workspace"
})
workspaceSchema.set('toObject', { getters: true });
workspaceSchema.set('toJSON', { getters: true });
const Workspace=db.model("Workspace",workspaceSchema)
module.exports=Workspace