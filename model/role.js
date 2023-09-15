const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const roleSchema=new mongoose.Schema({
    roleName:String,
    isActive:{
        type:String,
        default:true
    },
},{
    timestamps:true,
    versionKey:false,
    collection:"Role"
})

const Role=db.model("Role",roleSchema)
module.exports=Role