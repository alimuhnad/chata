var mongoose = require('mongoose');
//يعرف اليوزر و الايميل 

const Schema = mongoose.Schema
const userSchema= new Schema({
    
    fn:String,
    fid:String,
    uid:String,
    ln:String,
    lid:String,



})


module.exports = mongoose.model('savedrooms',userSchema)
