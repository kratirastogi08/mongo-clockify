const express=require('express')
const app=express()
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()
const path=require('path')
const port=4000

app.use(cors())
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use("/api",require("./routes"))

app.listen(port,(req,res)=>{
    console.log("server is running")
})