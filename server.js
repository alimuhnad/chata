//اعدادات السيرفر

const express = require('express')
const bodyParser = require('body-parser')
const cors=require('cors');
const api = require('./routes/api');
const User=require('../server/models/users')
const Savedroom=require('../server/models/savedroom')
const WT=require('../server/models/userWT')

const app = express()


app.use(bodyParser.json())
app.use(cors())
app.use('/api',api)

let http = require('http').Server(app);
let io = require('socket.io')(http);
 
var mongoose = require('mongoose');
mongoose.connect('mongodb://a:a@ds135290.mlab.com:35290/chat');

//mongoose.connect('mongodb://localhost:27017/chat');

app.post('/log',(req,res)=>{
  let userDate=req.body;
  User.findOne({phonenum:userDate.phone},(err,User)=>{
    if(err){
      console.log(err);
    }else{
      if(!User){
        res.status(401).send('invalid')
      }else{
        if(User.password !== userDate.password){
          res.status(401).send('invalid')
        }else{
         //  let payload={subject : User._id}
         //  let token =jwt.sign(payload,'secritkey')
          res.status(200).send('ok')
        }
      }
    }
  })
})
app.post('/find',(req,res)=>{
  let userDate=req.body;
  User.findOne({phonenum:userDate.phone},(err,s)=>{
    if(err){
      console.log(err);
    }else{
      res.json(s)

    }
  })
})
// تسجيل
app.post('/reg', function(req, res) {
    User.create({
        phonenum: req.body.phone,
        username:req.body.user,
        password:req.body.password,
    }, function(err, review) {
        if (err)
            res.send(err); 
    });
  });

// 
app.post('/MWT', function(req, res) {
  WT.create({
    fn: req.body.fn,
    fid:req.body.fid,
    uid:req.body.uid,
    ln: req.body.ln,
    lid:req.body.lid
  }, function(err, review) {
      if (err)
          res.send(err); 
  });
});



// برايفت جات بين ثنين معتمدين على الرقم مال الروم  
app.post('/GMWT', function(req, res) {
  let userDate=req.body;
  WT.findOne( { fn: userDate.fn,fid:userDate.fid,ln: userDate.ln,lid:userDate.lid},
    (err,s)=>{
    if(err){
      console.log(err);
    }else{
      if(!s){
        console.log(s)
        WT.findOne({ln: userDate.fn,lid:userDate.fid,fn: userDate.ln,fid:userDate.lid},
          (err,ss)=>{
          if(err){ console.log(err);}
           else{
            console.log(ss)

             if(!ss){
               var uiid=Math.floor(Math.random() * 10000000000) + 1;
              WT.create({
                fn: req.body.fn,
                fid:req.body.fid,
                uid:uiid,
                ln: req.body.ln,
                lid:req.body.lid
              }, function(err, review) {
                  if (err)
                      res.send(err); 
                      res.json(review);
                      Savedroom.create({
                        fn: req.body.fn,
                        fid:req.body.fid,
                        uid:uiid,
                        ln: req.body.ln,
                        lid:req.body.lid
                      }, function(err, review) {
                          if (err)
                              res.send(err); 
                              res.json(review);
                      });
              });
             }else{
              res.json(ss);

             }
           }
           })
    
      }else{
        res.json(s);
      }
      }
      })
     });

//
app.post('/GMWTM', function(req, res) {
  let userDate=req.body;
  WT.findOne( { fn: userDate.fn,fid:userDate.fid,uid:userDate.uid,ln: userDate.ln,lid:userDate.lid},
    (err,s)=>{
    if(err){
      console.log(err);
    }else{
      if(!s){
        WT.findOne({ln: userDate.fn,lid:userDate.fid,uid:userDate.uid,fn: userDate.ln,fid:userDate.lid},
          (err,ss)=>{
          if(err){ console.log(err);}
           else{
            console.log(ss)
              WT.create(   { fn:userDate.ln,
                fid:userDate.lid,
                uid:userDate.uid,
                ln:userDate.fn,
                lid:userDate.fid,
                senderid:userDate.senderid,
                msgbody:userDate.msgbody,
                createedtime:userDate.createedtime
                },
  
                (err,ss)=>{
                if(err){ console.log(err);}
                 else{
                   
                    res.send("ok");
                  
                }})
           }
           })
      }else{
        let userDate=req.body;
        WT.create(   { 
          fn:userDate.fn,
          fid:userDate.fid,
          uid:userDate.uid,
          ln:userDate.ln,
          lid:userDate.lid,    
          senderid:userDate.senderid,
          msgbody:userDate.msgbody,
          createedtime:userDate.createedtime
          },
  
          (err,s)=>{
          if(err){
            console.log(err);
            }else{
              res.send("ok");
            }
          
          
          })
      }             
      }
      })
     });

app.post('/GMSGSss', function(req, res) {
  let userDate=req.body;
  WT.find({ uid:userDate.uid},(err,z)=>{
    if(err){
      console.log(err);
    }else{
      res.json(z);
        }
      })
     });

       app.get('/getuser', function(req, res) {
        let userDate=req.body;
        User.find({},(err,User)=>{
          if(err){
            console.log(err);
          }else{
            res.json(User);
              }
            
            })
           });




           
      app.post('/getrooms', function(req, res) {
      let userDate=req.body;
      Savedroom.find( {$or: [
        {'fid':userDate.fid},
        {'lid':userDate.fid}
      ]},(err,rv)=>{
        if(err){
          console.log(err);
        }else{
          
            console.log(rv)
            res.json(rv);
          
          }
          })
          })
      
          

        
app.get('/', function (req, res) {
res.send('hello world')
})

io.on('connection',(socket)=>{

  console.log('new connection made.');


  socket.on('join', function(data){
    //joining
    socket.join(data.room);

    console.log(data.user + 'joined the room : ' + data.room);

    socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
  });
 

  socket.on('leave', function(data){
  
    console.log(data.user + 'left the room : ' + data.room);

    socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

    socket.leave(data.room);
  });

  socket.on('message',function(data){

    io.in(data.room).emit('new message', {user:data.user, message:data.message});
    
      })
    });

  // socket.on('disconnect', function(){
  //   io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  // });
 
  // socket.on('set-nickname', (nickname) => {
  //   socket.nickname = nickname;
   
  //   io.emit('users-changed', {user: nickname, event: 'joined'});    
  // });
  // socket.on('set-room', (room) => {
  //   data.room = room;
  // });
  // socket.on('add-message', (message) => {
  //   console.log(message)
      
  //  io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  // });

var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});


module.exports = app;
