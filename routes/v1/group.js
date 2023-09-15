const router = require('express').Router()
const {createGroup,addMembersToGroup,groupList}=require("../../controller/group")


router.post("/create",createGroup)
router.post("/addUsersToGroup",addMembersToGroup)
router.get("/list/:workspaceId",groupList)
module.exports=router