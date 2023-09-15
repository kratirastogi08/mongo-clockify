const Tag=require("../model/tag")
const createTag=async(req,res,next)=>{
  try{
    const {workspaceId,tagName}=req.body;
  const data=await Tag.findOne({
        workspaceId,
        tagName
    })
    if(data)
    {
    return res.status(409).json({message:"TagName already exixys"})
    }
   const tag=await Tag.create({
    workspaceId,
    tagName
   })
   return res.status(201).json({message:"Successful",data:tag})
  }
  catch(error)
  {
    console.log(error)
    throw error
  }
}
const tagList=async(req,res,next)=>{
  try{
     const {type,searchTerm}=req.query;
     const {workspaceId}=req.params
     let obj={}
     if(type)
     {
        switch(type)
        {
            case "active":
            obj["isActive"]=true
            break;
            case "inactive":
            obj["isActive"]=false
            break;
        }
     }
     if(searchTerm)
        {
        obj["tagName"]={$regex:searchTerm,$options:"i"}
        }
   const data= await Tag.find({
        workspaceId,
       ...obj 
     })
     return res.status(200).json({message:"Success",data})
  }
  catch(error)
  { console.log(error)
    throw error
  }
}
module.exports={
    createTag,
    tagList
}