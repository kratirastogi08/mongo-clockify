const Group=require("../model/group")
const createGroup=async(req,res,next)=>{
   try{
        const {groupName,workspaceId}=req.body;
      const group=await Group.findOne({
            groupName,
            workspaceId
        })
        if(group)
        {
            return res.status(409).json({messsage:"Group Name already exists"})
        }
        const newGroup=await Group.create({
                groupName,workspaceId
             })
        return res.status(201).json({message:"Successful",data:newGroup})
        
   }
   catch(error)
   {   console.log(error)
       throw error
   }
}

const addMembersToGroup=async(req,res,next)=>{
  try{
    const {userIds,groupId}=req.body;
    if(userIds && userIds.length)
    {
        await Group.updateOne({
            _id:groupId
        },{
            $set:{members:[]}
        })

       await Group.updateOne({
            _id:groupId  
        },{
            $push:{              
                members:{
                    $each:userIds
                }
              
            }
        })
        
    }
    return res.status(200).json({message:"Success"})
  }
  catch(error)
  { console.log(error)
    throw error
  }
}

const groupList=async(req,res,next)=>{
  try{
    const {workspaceId}=req.params
   const data= await Group.find({
      workspaceId  
    },{"groupName":1,"workspaceId":1,"members":1}).populate([{
        path:"members",
        select:'firstName lastName'
    }])
    return res.status(200).json({data})
  }
  catch(error)
  { console.log(error)
    throw error
  }
}
module.exports={
    createGroup,
    addMembersToGroup,
    groupList
}