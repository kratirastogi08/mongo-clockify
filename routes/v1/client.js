const router=require("express").Router()
const {createClient,clientList,clientProjectList}=require("../../controller/client")


router.post("/create",createClient)
router.get("/list/:workspaceId",clientList)
router.get("/projectList",clientProjectList)
module.exports=router