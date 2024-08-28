
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    username : String,
    Password:String,
    phone:Number,
    email:String,
    usertype:String
    
});

module.exports = mongoose.model('user', UserSchema); // Correct export
