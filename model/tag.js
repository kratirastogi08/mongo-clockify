const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const tagSchema=new mongoose.Schema({
    tagName:String,
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
    collection:"Tag"
})

const Tag=db.model("Tag",tagSchema)
module.exports=Tag