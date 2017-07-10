var express = require("express"),
    app =express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/explore_camps");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //za main.css samo linkamo /stylesheets jer gleda u public folder

//seeding database
seedDB;

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX ROUTE - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: camps});
        }
    });
});

//CREATE ROUTE - ADD CAMP TO DATABASE
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW ROUTE - SHOWS INFO ABOUT CAMPGROUND
app.get("/campgrounds/:id", function(req, res) {
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

//----------------------------------------
//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: camp});
        }
    });
});

app.post("/campgrounds/:id", function(req, res){
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
//----------------------------------------


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting server...");
});