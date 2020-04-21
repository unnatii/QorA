var express= require("express");
const router=express.Router({mergeParams:true});
var uservar=require('../models/user.js');
var passport=require('passport');

router.get("/register",function(req,res){
	res.render("register");
})
router.post("/register",function(req,res){
	var newUser=new uservar({username:req.body.username});
	uservar.register(newUser,req.body.password,function(err,usr){
		if(err){
			console.log(err);
			res.render("register");
		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/home");
			})
		}
	})
})

router.get("/login",function(req,res){
	res.render("login");
})
router.post("/login",passport.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/login"

 }),function(req,res){

 });

router.get("/logout",function(req,res){
	req.logOut();
	res.redirect("/home");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports=router;