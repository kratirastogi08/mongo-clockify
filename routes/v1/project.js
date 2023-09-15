const router=require("express").Router()
const {createProject,addMembersToProject,projectList,projectMemberList,createTask,taskList,addAssigneesToTask}=require("../../controller/project")
const {authentication}=require("../../middleware/auth")


router.post("/create",authentication,createProject)
router.post("/addMembersToProject",authentication,addMembersToProject)
router.get("/list/:workspaceId",authentication,projectList)
router.get("/projectMemberList/:projectId",authentication,projectMemberList)
router.post("/createTask",authentication,createTask)
router.get("/taskList/:workspaceId/:projectId",authentication,taskList)
router.patch("/assignMembersToTask/:taskId",authentication,addAssigneesToTask)

module.exports=router