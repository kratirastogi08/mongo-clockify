const mongoose=require("mongoose")
mongoose.Promise = global.Promise;
const connections={}
const createConnection=(mongoUri)=>{
    if(connections[mongoUri])
    {
        return connections[mongoUri]
    }
    const connection=mongoose.createConnection(mongoUri,{
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    })
    connection.on('connected',()=>{
        console.log("Database connection established successfully");
    })
    connection.on('error', (err) => {
        console.log(`Database connection has occured error: ${err}`)   
       })
       connection.on("disconnected", () => {
         console.log("Database connection has been disconnected");
       });
       connections[mongoUri]=connection;
       return connection;
}

module.exports={
    getDB:createConnection.bind(null,process.env.MONGO_URI)
}