const Project = require("../model/project");
const Timesheet = require("../model/timesheet")
const moment = require("moment")
const _=require("lodash")
const { ObjectId } = require('mongodb')
const {convertSecondsToHrs}=require("../utils/helper")

const addWorkItems = async (req, res, next) => {
    try {
        const { userId } = req.data;
        let { projectId, workStartTime, workEndTime, ...fields } = req.body;
        const _workStartTime = moment(workStartTime)
        const _workEndTime = moment(workEndTime)
        const workTimePeriod = moment.duration(_workEndTime.diff(_workStartTime)).asSeconds()
        fields = {
            ...fields,
            workStartTime,
            workEndTime,
            workTimePeriod,
            userId
        }
        if (projectId) {
            const project = await Project.findOne({
                _id: projectId
            }, {
                clientId: 1
            })
            const clientId = project?.clientId
            fields = {
                ...fields,
                projectId,
                clientId
            }
        }

        const timesheet = await Timesheet.create({
            ...fields
        })
        return res.status(200).json({
            message: "Success",
            data: timesheet
        })
    }
    catch (error) {
        console.log(error)
        throw error
    }
}
const editWorkItems = async (req, res, next) => {
    try {
        const { workItemId } = req.params;
        const data = await Timesheet.updateOne({
            _id: workItemId
        }, {
            $set: {
                ...req.body
            }
        })
        return res.status(201).json({ message: "Success", data })
    }
    catch (error) {
        console.log(error)
        throw error
    }
}
const timeEntriesWeekwise = async (req, res, next) => {
    try {
        const { workspaceId } = req.query;
        const { userId } = req.data;
        const arr=[]
        const years = await Timesheet.aggregate([
            {
                $match: { workspaceId: { $eq: new ObjectId(workspaceId) }, userId: { $eq: new ObjectId(userId) } }
            },
            {
                $group: {
                    _id: {
                        $isoWeekYear: "$workDate"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    "year": "$_id"
                }
            }
        ])
        if (years && years.length) {
         await Promise.all(years.map(async y => {
                const weekData=await Timesheet.aggregate([
                    {
                        $match: {
                            $and: [
                                { workspaceId: { $eq: new ObjectId(workspaceId) } },
                                {
                                    userId: { $eq: new ObjectId(userId) }
                                },
                                {
                                    $expr: {
                                        $eq: [{ $isoWeekYear: "$workDate" }, y.year]
                                    }
                                }
                            ]
                        }
                    }
                    ,
                    {
                        $group:{
                            _id:{
                                $isoWeek:"$workDate"
                            }
                        }
                    },
                    {
                        $project:{
                            _id:0,
                            "week":"$_id"
                        }
                    }
                ])
                await Promise.all(weekData.map(async w=>{
                    let data=  await Timesheet.aggregate([{
                           $match:{
                              $and: [
                                  { workspaceId: { $eq: new ObjectId(workspaceId) } },
                                  {
                                      userId: { $eq: new ObjectId(userId) }
                                  },
                                  {
                                    $expr: {
                                        $eq: [{ $isoWeekYear: "$workDate" }, y.year]
                                    }
                                },
                                  {
                                      $expr: {
                                          $eq: [{ $isoWeek: "$workDate" }, w.week]
                                      }
                                  }
                              ]
                          }
                      },                   
                    ])
                    
                      let totalTime=_.sumBy(data,"workTimePeriod")
                       totalTime=convertSecondsToHrs(totalTime)
                      data=data.map(d=>{
                        const time= convertSecondsToHrs(d.workTimePeriod)
                        d.workTimePeriod=time;
                        return d
                     })
                      const weekFirstDay=moment().year(y.year).day("Monday").isoWeek(w.week)
                      const weekLastDay=moment(weekFirstDay).add(6,"days")
                      arr.push({
                        date:`${weekFirstDay}-${weekLastDay}`,
                        totalTime,
                        data
                      })
                  }))
            }))
        }
        return res.status(200).json({message:"Success",data:arr});
    }
    catch (error) {
        console.log(error)
        throw error
    }
}
module.exports = {
    addWorkItems,
    editWorkItems,
    timeEntriesWeekwise
}