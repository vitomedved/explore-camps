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
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//testiranje dodavanja u db
// Campground.create(
//     {
//         name: "Green Mystic",
//         image: "https://source.unsplash.com/mzZVGFfMOkA",
//         description: "This is a huge nature-side camp, enjoy!"
//     }, function(err, campground){
//         if(err){
//             console.log("Error " + err);
//         }else{
//             console.log("Newly created campground\n" + campground);
//         }
    
// });
//INDEX ROUTE - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds: camps});
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
    res.render("new");
});

//SHOW ROUTE - SHOWS INFO ABOUT CAMPGROUND
app.get("/campgrounds/:id", function(req, res) {
    //findcamp with id
    Campground.findById(req.params.id, function(err, camps){
        if(err){
            console.log("ERROR \n" + err + "\n ERROR");
        }else{
            //console.log(camps + "\n");
            res.render("show", {campground: camps});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting server...");
});