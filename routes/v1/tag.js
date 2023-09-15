const router=require("express").Router()
const {createTag,tagList}=require("../../controller/tag")


router.post("/create",createTag)
router.get("/list/:workspaceId",tagList)
module.exports=router