const router = require('express').Router()
const {signUp,login,addUsersToWorkspace,members,pdf}=require("../../controller/user")


router.post("/register",signUp)
router.post("/login",login)
router.post("/addUsersToWorkspace",addUsersToWorkspace)
router.get("/members/:workspaceId",members)
router.get("/pdf",pdf)
module.exports=router