var express= require("express");
var router=express.Router({mergeParams:true});
var card=require('../models/card.js');
var commentcard=require('../models/comments.js');


router.get("/new",isLoggedIn,function(req,res){
	card.findById(req.params.id,function(err,coinfo){
		if(err){
			console.log(err);
		}else{
			//console.log("ci"+commentinfo);
			res.render("comments/new",{commentinfo:coinfo});
		}
	})
 })

router.post("/",isLoggedIn,function(req,res){
	card.findById(req.params.id,function(err,info){
		if(err){
			console.log(err);
		}else{
			var comob={
				text:req.body.comtext
			}
            commentcard.create(comob,function(err,commentObj){
            
            commentObj.author.id=req.user.id;
            commentObj.author.username=req.user.username;
            commentObj.save();
		    info.comment.push(commentObj);
		    info.save();
		    res.redirect("/home/"+info._id);
			})
		  
		}
	})
 })

 router.get("/:comment_id/edit",checkOwner,function(req,res){
	 card.findById(req.params.id,function(err,foundcard){
		 if(err){
			 res.redirect("back")
		 }else{
			commentcard.findById(req.params.comment_id,function(err,foundcomment){
				// console.log(req.params.comment_id);
				// console.log("tet"+foundcomment);
				res.render("comments/edit",{cominfo:foundcomment , cardinfo:foundcard});
			})
		 }
	 })
})
router.post("/:comment_id",checkOwner,function(req,res){
//	res.send("edited");
 var commentobj={
	 text:req.body.comtext
 }
commentcard.findByIdAndUpdate(req.params.comment_id, commentobj,function(err,updatedcomment){
	if(err){
		console.log("e--"+err);
	}else{
		console.log("done!");
		res.redirect("/home/"+req.params.id);
	}
})
})

router.delete("/:comment_id",checkOwner,function(req,res){
	commentcard.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log("e--"+err);
		}else{
			console.log("done!");
			res.redirect("/home/"+req.params.id);
		}
	})
	})
	

// router.delete("/:comment_id",checkOwner,function(req,res){
// card.findByIdAndRemove(req.params.id,function(err){
// 	if(err){
// 		res.redirect("/home");
// 	}else{
// 		res.redirect("/home");
// 	}
// })
// //res.send("delete");
// })


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