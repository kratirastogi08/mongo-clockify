const Project=require("../model/project");
const Group=require("../model/group")
const Task=require("../model/task")
const createProject=async(req,res,next)=>{
  try{
    const {workspaceId,projectName}=req.body;
    const {userId}=req.data;
    console.log(userId)
    
   const data= await Project.findOne({
       workspaceId,
       projectName 
    })

    if(data)
    {
        return res.status(409).json({message:"Project name already exists"})
    }
   const project=  await Project.create({
        ...req.body,
        access:[userId]
     })
     return res.status(201).json({message:"Success",data:project})
  }
  catch(error)
  {
    //console.log(error)
    throw error
  }
}
const addMembersToProject=async(req,res,next)=>{
 try{
     let {userIds,groupIds,projectId,workspaceId}=req.body;
     if(groupIds && groupIds.length)
     {
      const groups= await Group.find({
        _id:{$in:groupIds},
        workspaceId
         },{groupName:1,members:1})
      console.log(groups)
         groups.forEach(g=>{
        userIds.push(...Array.from(new Set([...g.members])) )
        })
     }
     userIds=Array.from(new Set([...userIds]))
   const data=  await Project.updateOne({
        _id:projectId
     },{
        $set:{access:userIds}
     },{new :true})
     return res.status(200).json({message:"Success",data})
     
 }
 catch(error)
 {  console.log(error)
    throw error
 }
}

const projectList=async(req,res,next)=>{
 try{
 let {isBillable,type,clientIds,access,searchTerm}=req.query;
 const {workspaceId}=req.params
 let obj={}
 if(isBillable!==undefined)
 {
   obj["isBillable"]=isBillable
 }
 if(clientIds && clientIds.length)
 {  let array=[]
   clientIds=JSON.parse(clientIds)
   if(clientIds.includes("without client"))
   { 
     clientIds= clientIds.filter(c=>c!=="without client")
     array.push({clientId:null})
   }
   array.push({clientId:{$in:clientIds}})
   obj["$or"]=array
 }
 if(access)
 { access=JSON.parse(access)
   let {groupIds,userIds}=access;
    if(groupIds && groupIds.length)
    {
    const groups= await Group.find({_id:{$in:groupIds}})
    groups.forEach(g=>{
      userIds.push(...Array.from(new Set([...g.members])))
    })
    userIds=Array.from(new Set([...userIds]))
    }
   obj["access"]={$in:userIds}
 }
 if(type)
 {
   switch(type){
      case "active":
         obj["isActive"]=true
         break;
      case "inactive":
         obj["isActive"]=false
   }
 }
 if(searchTerm)
 {
   obj["projectName"]={$regex:searchTerm,$options:"i"}
 }
 const project=await Project.find({workspaceId,...obj}).populate([{path:"clientId"},{path:"access",model:"Users"}]).exec()
 return res.status(200).json({message:"Success",data:project})
 }
 catch(error)
 { console.log(error)
   throw error
 }
}

const projectMemberList=async(req,res,next)=>{
try{
     const {projectId}=req.params
    const members=await Project.findOne({_id:projectId},{access:1}).populate([{path:"access",model:"Users",select:"firstName lastName"}])
    return res.status(200).json({message:"Success",data:members})

}
catch(error)
{
   console.log(error)
   throw error
}
}

const createTask=async(req,res,next)=>{
try{
 const data=  await Task.findOne({
      workspaceId:req.body.workspaceId,
      projectId:req.body.projectId,
      taskName:req.body.taskName
   })
   if(data)
   {
      return res.status(409).json({message:"Task already exists"})
   }
   const task=await Task.create({
         ...req.body
      })
      return res.status(201).json({message:"Success",data:task})
}
catch(error)
{  console.log(error)
   throw error
}
}
const taskList=async(req,res,next)=>{
try{
   const {type,searchTerm}=req.query;
     const {workspaceId,projectId}=req.params
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
        obj["taskName"]={$regex:searchTerm,$options:"i"}
        }
   const data= await Task.find({
        workspaceId,
        projectId,
       ...obj 
     })
     return res.status(200).json({message:"Success",data})   
}
catch(error)
{  console.log(error)
   throw error
}
}
const addAssigneesToTask=async(req,res,next)=>{
 try{
    let {groupIds,userIds}=req.body;
    const {taskId}=req.params;
    if(groupIds && groupIds.length)
    {
    const groups= await Group.find({_id:{$in:groupIds}})
    groups.forEach(g=>{
       userIds.push(...Array.from(new Set([...g.members])))
    })
    userIds=Array.from(new Set([...userIds]))
    }
   const data=await Task.findOneAndUpdate({_id:taskId},{access:userIds},{new:true})
   return res.status(200).json({message:"Success",data})
 }
 catch(error)
 { console.log(error)
   throw error
 }
 }
module.exports={
    createProject,
    addMembersToProject,
    projectList,
    projectMemberList,
    createTask,
    taskList,
    addAssigneesToTask

}