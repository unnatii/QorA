var mongoose = require('mongoose');
var pasLocMon=require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  password: String,

});

userSchema.plugin(pasLocMon);

module.exports=mongoose.model('usermodel', userSchema );