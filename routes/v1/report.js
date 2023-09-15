const router=require("express").Router()
const {summary,latestActivity,totalTrackActivities,projectwiseActivities}=require("../../controller/report")


router.get("/summary",summary)
router.get("/latestActivity",latestActivity)
router.get("/totalTrackActivity",totalTrackActivities)
router.get("/projectwiseActivities",projectwiseActivities)
module.exports=router