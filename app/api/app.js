const express = require('express');
const app =express();
const categoryroute =require('./apis/routes/categories');
const mongoose =require('mongoose');
const bodyparser =require('body-parser');
const userroute =require('./apis/routes/user');


//mongoose.connect('mongodb+srv://himanshu11752:uVRQaBnhLCq5nwrh@cafetrains.vcuee.mongodb.net/')4
mongoose.connect('mongodb+srv://sahsingh:j%40rWPTNcs5fYJ7w@cluster0.0i71pce.mongodb.net/')


mongoose.connection.on('error',err=>{
    console.log('connection failed')
})
mongoose.connection.on('connected' ,connected=>{
    console.log('connected with database..')
})
app.use(bodyparser.urlencoded({extends:false}));
app.use(bodyparser.json());
app.use('/categories',categoryroute)
app.use('/user',userroute)


module.exports=app;