//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app =  express();
const bcrypt = require("bcrypt");
const saltRounds = 10;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology: true, useNewUrlParser: true,});


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
});



const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})



app.post("/register",function(req,res){

    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
 
    const newuser = new User({
        email:req.body.username,
        password:hash
    });
    newuser.save(function(err){
        if(err){
                console.log(err);
        }else{
            res.render("secrets");
        }
    });        
   });


});

app.post("/login",function(req,res){


    User.findOne({email:req.body.username},function(err,founduser){
        if(err){
                console.log(err);
        }else{
            if (founduser){
                bcrypt.compare(req.body.password, founduser.password).then(function(result) {
                 if(result === true){
                    res.render("secrets");
                 }
            });
                
            }
        }        
    });
});


app.listen(3000,function(){
    console.log("server started on port 3000");
});