const Timesheet=require("../model/timesheet")
const Group=require("../model/group")
const { ObjectId } = require('mongodb')
const summary=async(req,res,next)=>{
try{
       const {workplaceId,startDate,endDate,...filters}=req.query;
       let filterArray=[]
       
       if(filterArray)
       {
        let {project,client,task,tag,status,description,team}=filters;
        
        if(project)
        {  const arr=[]
        project=JSON.parse(project)
        if(project.includes("without"))
        {     
              arr.push({projectId:null})  
        }
        project=project.filter(p=>p!=="without")
        arr.push({
           projectId:{$in:project} 
        })
        filterArray.push({$or:arr})
        }
        if(client)
        { const arr=[]
         client=JSON.parse(client)
        if(client.includes("without"))
        {
              arr.push({clientId:null})  
        }
        client=client.filter(p=>p!=="without")
        arr.push({
           clientId:{$in:client} 
        })
        filterArray.push({$or:arr})
        }
        if(task)
        {
        const arr=[]
        task=JSON.parse(task)
        if(task.includes("without"))
        {
              arr.push({taskId:null})  
        }
        task=task.filter(p=>p!=="without")
        arr.push({
           taskId:{$in:task} 
        })
        filterArray.push({$or:arr})
        }
        if(tag)
        {
        const arr=[]
        tag=JSON.parse(tag)
        if(tag.includes("without"))
        {
              arr.push({tagIds:[]})  
        }
        tag=tag.filter(p=>p!=="without")
        arr.push({
            tagIds:{$in:tag}        
        })
        filterArray.push({$or:arr})
        }
        if(status)
        { const arr=[]
          status=JSON.parse(status)
          if(status.includes("billable"))
          {
            arr.push({isBillable:true})
          }
          if(status.includes("nonbillable"))
          {
            arr.push({isBillable:false})
          }
          filterArray.push({$or:arr})
        }
        if(description)
        {
            filterArray.push({workDesc:{$regex:description,$options:"i"}})
        }
        if(team)
        { team=JSON.parse(team)
            console.log(typeof team)
         let {userIds,groupIds}=team
         if(groupIds && groupIds.length)
         {
         const groups=await Group.find({
              _id:{$in:groupIds}
            })
            groups.forEach(g=>{
                userIds.push(...Array.from(new Set([...g.members])))
            })
         }
         userIds=Array.from(new Set([...userIds]))
         filterArray.push({
            userId:{$in:userIds}
         })
        }
    }
    const data= await Timesheet.find({
        $and:[
            {workplaceId},
           { workDate:{
                $gte:startDate,
                $lte:endDate
            }},
            ...filterArray
        ]
       })
       console.log(data)
       return res.status(200).json({message:"Success",data})
}
catch(error)
{   console.log(error.message)
    throw error
}
}

const latestActivity=async(req,res,next)=>{
  try{
    const {workspaceId}=req.query
    const data=  await Timesheet.aggregate([
        {
            $match:{workspaceId:new ObjectId(workspaceId)},            
        },{
            $lookup:{
                from:"Timesheet",
                as:"LatestActivity",
                let:{workspaceId:"$workspaceId",userId:"$userId",createdAt:"$createdAt"},
                pipeline:[
                  {
                    $match:{workspaceId:new ObjectId(workspaceId)}
                  },
                  {
                    $group:{
                       _id:"$userId",
                       latestActivity:{
                        $max:"$createdAt"
                       }
                    }
                  },
                  {
                      $match:{
                        $expr:{
                            $and:[
                                {
                                    $eq:["$_id","$$userId"]
                                },
                                {
                                    $eq:["$latestActivity","$$createdAt"]
                                }
                            ]
                        }
                      }
                  }
                ]
            }
        },{
            $match:{
                LatestActivity:{
                    $ne:[]
                }
            }
        }
      ])
      return res.json({
        data
      })
  }
  catch(error)
  { console.log(error)
    throw error
  }
}

const totalTrackActivities=async(req,res,next)=>{
   try{
         const {workspaceId}=req.query;
         const data=  await Timesheet.aggregate([
          {
            $match:{
              workspaceId:new ObjectId(workspaceId)
            }
          },
          {
            $lookup:{
              from:"Timesheet",
              as:"users",
              let:{
                 workspaceId:"$workspaceId",
                 userId:"$userId"
              },
              pipeline:[
                {
                  $match:{
                    workspaceId:new ObjectId(workspaceId)
                  }
                },
                {
                  $group:{
                    _id:{
                      user:"$userId",
                      workspaceId:"$workspaceId"
                    },
                    billableTime:{ $sum:{
                      $cond:
                        [{$eq:["$isBillable",true]},'$workTimePeriod',0]
                      
                    }},                   
                    nonBillableTime:{
                      $sum:{
                        $cond:
                          [{$eq:["$isBillable",false]},'$workTimePeriod',0]
                    }
                  }
                }
              },
              {
                $match:{
                  $expr:{
                    $and:[
                      {
                        $eq:["$_id.user","$$userId"]
                      },
                      {
                        $eq:["$_id.workspaceId","$$workspaceId"]
                      }
                    ]
                  }
                }
              }
              ]
            }
          },
          {
            $group:{
              _id:"$users._id",
              billable:{$first:"$users.billableTime"},
              nonBillable:{$first:"$users.nonBillableTime"}
            }
          },
          {
            $project:{
              billable:{$arrayElemAt:["$billable",0]},
              nonBillable:{$arrayElemAt:["$nonBillable",0]}
            }
          }
         ])
         return res.json({
          data
         })
   }
   catch(error)
   { console.log(error)
    throw error
   }
}

const projectwiseActivities=async(req,res,next)=>{
  try{
    const {workspaceId}=req.query
      const data=  await Timesheet.aggregate([
          {
            $match:{
              workspaceId:new ObjectId(workspaceId)
            }
          },
          {
            $group:{
              _id:{
                workspaceId:"$workspaceId",
                userId:"$userId",
                projectId:"$projectId"
              }
            }
          },
          {$lookup:{
            from:"Timesheet",
            as:"project",
            let:{
            workspaceId:"$_id.workspaceId",
            userId:"$_id.userId",
            projectId:"$_id.projectId"},
            pipeline:[
              {
                $match:{workspaceId:new ObjectId(workspaceId)}
              },
              {
                $match:{
                  $expr:{
                    $and:[
                      {$eq:["$workspaceId","$$workspaceId"]},
                      {
                        $eq:["$userId","$$userId"]
                      },
                      {
                        $eq:["$projectId","$$projectId"]
                      }
                    ]
                  }
                }
              },
              {$group:{
                _id:{
                  workspaceId:"$workspaceId",
                  userId:"$userId",
                  projectId:"$projectId",
                  billableTime:{ $sum:{
                    $cond:
                      [{$eq:["$isBillable",true]},'$workTimePeriod',0]
                    
                  }},                   
                  nonBillableTime:{
                    $sum:{
                      $cond:
                        [{$eq:["$isBillable",false]},'$workTimePeriod',0]
                  }
                }
  
                }
              }},
              {
                $replaceRoot: { newRoot: { $mergeObjects: [ "$_id", "$$ROOT" ] } }
              },
              {
                $project:{
                  _id:0
                }
              }
            ]
          },
          
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [ "$_id", "$$ROOT" ] } }
       },
       {
        $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$project", 0 ] }, "$$ROOT" ] } }
     },
       {
        $project:{
          _id:0,
          project:0
        }
       }

        ])
        return res.json({data})
  }
  catch(error)
  {
    console.log(error)
  }
}
module.exports={
    summary,
    latestActivity,
    totalTrackActivities,
    projectwiseActivities
}