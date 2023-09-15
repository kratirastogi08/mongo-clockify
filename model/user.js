const db=require("../config/database").getDB()
const mongoose=require("mongoose")
const {validateEmail,validatePhone}=require("../utils/validation")
const bcrypt = require("bcrypt")
const userSchema=new mongoose.Schema({
    eCode:Number,
    firstName:String,
    lastName:String,
    emailId:{
        type:String,
        trim:true,
        lowercase:true,
        validate:[validateEmail, 'Please fill a valid email address']
    },
    password:{
        type:String
    },
    countryCode:{
        type:String,
        default:"91"
    },
    phone:{
        type:String,
        validate:[validatePhone,"Please fill a valid phone number"]
    },
    profileImage:String,
    isActive:{
        type:Boolean,
        default:true
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role"
    },
    workspaceId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace"
    }],
},{
    timestamps:true,
    versionKey:false,
    collection:"Users"
})

userSchema.pre('save', function (next) {
    const user = this
    if (this.isModified('password')) {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err)
        } else {
          bcrypt.hash(user.password, salt, function (hashError, hash) {
            if (hashError) {
              return next(hashError)
            } else {
              user.password = hash
              next()
            }
          })
        }
      })
    } else {
      return next()
    }
  })
const User=db.model("Users",userSchema)
module.exports=User;