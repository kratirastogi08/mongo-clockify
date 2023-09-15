
const router=require("express").Router()
const {createRole}=require("../../controller/role")


router.post("/create",createRole)
module.exports=router