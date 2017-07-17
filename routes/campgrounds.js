var express=require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

//INDEX ROUTE - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: camps, currentUser: req.user});
        }
    });
});

//CREATE ROUTE - ADD CAMP TO DATABASE
router.post("/", function(req, res){
    //gett data from form and add to campgrounds array
    var name = req.body.name,
        img = req.body.image,
        description = req.body.description;
    var newCampground = {name: name, image: img, description: description};
    //create new camp and save to db
    Campground.create(newCampground, function(err, camp){
        if(err){
            console.log("Error: " + err);
        }else{
            res.redirect("/campgrounds");
            console.log("Added camp to database:\n" + camp);
        }
    });
});

//NEW ROUTE - SHOW FORM TO CREATE CAMPGROUND
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW ROUTE - SHOWS INFO ABOUT CAMPGROUND
router.get("/:id", function(req, res) {
    //findcamp with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, camps){
        if(err){
            console.log("ERROR \n" + err + "\n ERROR");
        }else{
            console.log(camps + "\n");
            res.render("campgrounds/show", {campground: camps});
        }
    });
});

module.exports = router;