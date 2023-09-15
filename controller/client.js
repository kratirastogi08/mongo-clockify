const Client=require("../model/client")
const createClient=async(req,res,next)=>{
  try{
    const {workspaceId,clientName}=req.body;
  const data=await Client.findOne({
        workspaceId,
        clientName
    })
    if(data)
    {
    return res.status(409).json({message:"ClientName already exixts"})
    }
   const client=await Client.create({
    workspaceId,
    clientName
   })
   return res.status(201).json({message:"Successful",data:client})
  }
  catch(error)
  {
    console.log(error)
    throw error
  }
}
const clientList=async(req,res,next)=>{
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
        obj["clientName"]={$regex:searchTerm,$options:"i"}
        }
   const data= await Client.find({
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

const clientProjectList=async(req,res,next)=>{
 const data= await Client.aggregate([
    {
      $lookup:{
        from:"Workspace",
          as:"work",
          let:{"d":"$workspaceId"},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:["$_id","$$d"]
                }
              }
            }
          ]
      }
    }
  ])
  return res.json({data})
}
module.exports={
    createClient,
    clientList,
    clientProjectList
}