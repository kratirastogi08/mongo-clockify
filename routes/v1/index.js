const app=require('express')()

app.use("/user",require("./user"))
app.use("/workspace",require("./workspace"))
app.use("/role",require("./role"))
app.use("/group",require("./group"))
app.use("/tag",require("./tag"))
app.use("/client",require("./client"))
app.use("/project",require("./project"))
app.use("/timesheet",require("./timesheet"))
app.use("/report",require("./report"))
module.exports=app;