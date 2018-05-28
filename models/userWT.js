var mongoose = require('mongoose');
//يعرف اليوزر و الايميل 

const Schema = mongoose.Schema
const userSchema= new Schema({
    
    fn:String,
    fid:String,
    uid:String,
    ln:String,
    lid:String,
    senderid:String,
    msgbody:String,
    createedtime:String


})


module.exports = mongoose.model('userWT',userSchema)
