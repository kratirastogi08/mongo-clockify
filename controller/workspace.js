const Workspace=require('../model/workspace')

const workspace=async(req,res,next)=>{
    try{
    const workspace=await Workspace.find({})
    return res.status(201).json({data:workspace})
    }
    catch(error)
    {
      throw error
    }
}



module.exports={
    workspace,
    
}