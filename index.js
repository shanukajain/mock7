const cors=require("cors")
const express=require("express");
const { UserRoute } = require("./route/userRoute");
const { connection } = require("./config/db");
const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Home page");
})
app.use("/user",UserRoute);

app.listen(4000,async()=>{
    try {
        await connection
        console.log("conected with DB and Port at 3000");
    } catch (error) {
        console.log(error);
    }
})