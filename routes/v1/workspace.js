const router = require('express').Router()
const {workspace}=require("../../controller/workspace")


router.get("/get",workspace)
module.exports=router

