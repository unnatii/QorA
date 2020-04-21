var express= require("express");
var Dictionary = require("oxford-dictionary");
var router=express.Router({mergeParams:true});
var card=require('../models/card.js');
var config = {
    app_id : "286d5007",
    app_key : "bbf0a66e1213973517a214a11c9fbc16",
    source_lang : "en-us"
  };
  
var dict = new Dictionary(config);
router.get("/",function(req,res){
	card.find({},function(err,allcard){
		if(err){
			console.log(err);
		}else{
			console.log("home");
			res.render("home/index",{list:allcard});
		}
	})
})

router.post("/word",function(request,response){
	var word = request.body.word;
	var lookup = dict.definitions(word);
	var wordarr=[];
	card.find({},function(err,allcard){
		if(err){
			console.log(err);
		}else{
			lookup.then(function(res) {
				response.render("home/wordhome",{list:allcard,worddef:res});
		  },
		  function(err) {
			  console.log(err);
		  });
		}
	})
})

router.post("/",isLoggedIn,function(req,res){

    var auth={
        id:req.user.id,
        username:req.user.username
    }
	var obj={question :req.body.question,
		image :req.body.image,
        author:auth
	};
	card.create(obj,function(err,newcard){
		if(err){
			console.log(err);
		}else{
			res.redirect("home");
		}
	})
	
})

router.get("/new",isLoggedIn,function(req,res){
	res.render("home/new");
 })

router.get("/:id",function(req,res){
	card.findByIdAndUpdate(req.params.id).populate('comment').exec(function(err,foundcard){
		if(err){
			console.log(err);
		}else{
			console.log(foundcard);
			res.render("home/show",{cardinfo:foundcard});
		}
	})
 })

 router.get("/:id/edit",checkOwner,function(req,res){
		card.findById(req.params.id,function(err,foundcard){
				res.render("home/edit",{cardinfo:foundcard});
		})
 })
 router.put("/:id",checkOwner,function(req,res){
	 var cardobj={
		 question:req.body.question,
		 image:req.body.image
	 }
	card.findByIdAndUpdate(req.params.id, cardobj,function(err,updatedcard){
		if(err){
			console.log("e--"+err);
		}else{
			res.redirect(req.params.id);
		}
	})
 })
 router.delete("/:id",checkOwner,function(req,res){
	card.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/home");
		}else{
			res.redirect("/home");
		}
	})
	//res.send("delete");
 })

 function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkOwner(req,res,next){
	if(req.isAuthenticated()){
		card.findById(req.params.id,function(err,foundcard){
			if(err){
				res.redirect("back");
			}else{
				if(foundcard.author.id.equals(req.user._id))
				next();
			}
		})

	}else{
		res.redirect("/login");
	}
}

module.exports=router;
