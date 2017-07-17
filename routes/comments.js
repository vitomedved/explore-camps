var express=require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: camp});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, camp) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports = router;