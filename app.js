var express= require("express");
var app=express();
app.set("view engine","ejs");
var bodyParser = require('body-parser');
var passport=require('passport');
var localstrategy=require('passport-local');
var methdOverride =require('method-override');
app.use(methdOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/wanderdb';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true  });
 var seed=require('./seed.js');
//  seed();
var card=require('./models/card.js');
var commentcard=require('./models/comments.js');
var uservar=require('./models/user.js');
//var Dictionary = require("oxford-dictionary");
var homeroute=require('./routes/home.js');
var commentroute=require('./routes/comments.js');
var authroute=require('./routes/index.js');

app.use(require('express-session')({
	 secret: 'keyboard cat', 
	 resave: true,
	  saveUninitialized: true
	 }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(uservar.authenticate()));
passport.serializeUser(uservar.serializeUser());
passport.deserializeUser(uservar.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})
app.use(authroute);
app.use("/home",homeroute);
app.use("/home/:id/comments",commentroute);

  



app.listen(3000,function(){
	console.log("Server Started!!")
})