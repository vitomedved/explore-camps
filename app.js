var express = require("express"),
    app =express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/explore_camps");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});


//SCHEMA setup ---------------------------------------------------
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//testiranje dodavanja u db
// Campground.create(
//     {
//         name: "Green Mystic",
//         image: "https://source.unsplash.com/mzZVGFfMOkA"
        
//     }, function(err, campground){
//         if(err){
//             console.log("Error " + err);
//         }else{
//             console.log("Newly created campground\n" + campground);
//         }
    
// });

app.get("/campgrounds", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds", {campgrounds: camps});
        }
    });
});

app.post("/campgrounds", function(req, res){
    //gett data from form and add to campgrounds array
    var name = req.body.name;
    var img = req.body.image;
    var newCampground = {name: name, image: img};
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

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting server...");
});