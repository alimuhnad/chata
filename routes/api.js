var express = require('express')
const jwt = require('jsonwebtoken')
var router = express.Router()
//اعدادات المنكوديبي و api كله
var mongoose = require('mongoose');
const User=require('../models/users')
var Filter = require('bad-words')
filter = new Filter();


//mongoose.connect('mongodb://a:a@ds135290.mlab.com:35290/chat');
const app = express()



//سحب بيانات المسجل حسب الرقم
router.get('/getuser', function(req, res) {
    let userDate=req.body;
    User.findOne({phonenum:userDate.phonenum},(err,User)=>{
      if(err){
        console.log(err);
      }else{
        res.json(User);
          }
        
        }) });















  module.exports = router;