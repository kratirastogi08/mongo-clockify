const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const authSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    token:String
},{
    versionKey:false,
    collection:"Auth"
})

const Auth=db.model("Auth",authSchema)
module.exports=Auth