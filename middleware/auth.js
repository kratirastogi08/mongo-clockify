const Auth=require("../model/auth")
const jwt=require("jsonwebtoken")
const authentication=(req,res,next)=>{
  try{
   let token=req.headers.authorization 
   token = token.replace("Bearer ", "")  
   if(!token)
   {
    return res.status(401).json({message:"Unauthorized"})
   }
  const data= jwt.verify(token,"secret_key")
  req.data={
    userId:data.userId,
    roleId:data.roleId
  }
  
  next();
  }
  catch(error)
  {
    //console.log(error)
    throw error
  }
}
module.exports={
    authentication
}