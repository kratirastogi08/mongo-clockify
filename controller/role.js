const Role=require("../model/role")
const createRole=async(req,res,next)=>{
  try{
      const role= await Role.create({
            ...req.body
          })
       res.status(201).json({...role._doc})   
  }
  catch(error){
    throw error
  }
}
module.exports={
    createRole
}