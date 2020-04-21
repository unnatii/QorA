var mongoose = require('mongoose');
//var comments   = require("/comments");

var cardschema = new mongoose.Schema({
  question: String,
  image: String,
  category:String,
  author: {
    id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"usermodel"
    },
    username:String
    
},
  comment:[
  {
  	 type: mongoose.Schema.Types.ObjectId,
     ref: "commentmodel"  //model name is comments
  }
  ]
});

module.exports=mongoose.model('cardmodel', cardschema );
