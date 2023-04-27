const express =require("express");
var jwt = require('jsonwebtoken');
const bcrypt=require("bcrypt");
const { UserModel } = require("../Model/usermodel");
const { Authorization } = require("../middilware/Authorization");
const UserRoute=express.Router();

UserRoute.get("/",(req,res)=>{
    res.send("user page")
})
UserRoute.post("/signup",async(req,res)=>{
let payload=req.body;
try {
    let data=await UserModel.findOne({Email:payload.Email});
    if(data){
        res.send({"msg":"account already exsit"})
    }else {
        bcrypt.hash(payload.Password, 5,async function(err, hash) {
            payload.Password=hash;
            let user=new UserModel(payload);
            await user.save();
            res.send({"msg":"account has been created"})
        });
       
    }
} catch (error) {
    console.log(error);
    res.send("error")
}
})
UserRoute.post("/signin",async(req,res)=>{
    try {
        let payload=req.body;
        console.log(payload)
        let data=await UserModel.findOne({Email:payload.Email});
        if(data){
            bcrypt.compare(payload.Password, data.Password, function(err, result) {
                if(result){
                    var token = jwt.sign({"userid":data._id}, 'masai');
                    res.send({"msg":"logged in","token":token});
                }else {
                    res.send({"msg":"wrong password"})
                }
            });  
        }else {
            res.send({"msg":"account Not exsit"})
        }
       
    } catch (error) {
        
    }
  
    
})
UserRoute.use(Authorization);
UserRoute.patch("/editprofile",async(req,res)=>{
    let payload=req.body;
    if(payload.Password){
        bcrypt.hash(payload.Password, 5,async function(err, hash) {
            payload.Password=hash;
            let userid=req.body.userid;
        let data=await UserModel.findByIdAndUpdate({"_id":userid},payload);
        res.send({"msg":"profile has been updated"});
        })
    }else {
    let userid=req.body.userid;
    let data=await UserModel.findByIdAndUpdate({"_id":userid},payload);
    res.send({"msg":"profile has been updated"});
}
})
UserRoute.get("/profile",async(req,res)=>{
let userid=req.body.userid;
let data=await UserModel.findOne({"_id":userid});
res.send(data);
})

module.exports={UserRoute}