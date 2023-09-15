const router=require("express").Router()
const {addWorkItems,editWorkItems,timeEntriesWeekwise}=require("../../controller/timesheet")
const { authentication } = require("../../middleware/auth")


router.post("/create",authentication,addWorkItems)
router.put("/edit/:workItemId",authentication,editWorkItems)
router.get("/workItems",authentication,timeEntriesWeekwise)

module.exports=router