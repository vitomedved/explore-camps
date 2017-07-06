var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

var campgrounds = [
            {name: "Dark Azure", image: "https://source.unsplash.com/qmZF9CptLKs"},
            {name: "Green Mystic", image: "https://source.unsplash.com/mzZVGFfMOkA"},
            {name: "Colorful Beauty", image: "https://source.unsplash.com/waTo4DNZ4zE"},
            {name: "Dark Azure", image: "https://source.unsplash.com/qmZF9CptLKs"},
            {name: "Green Mystic", image: "https://source.unsplash.com/mzZVGFfMOkA"},
            {name: "Colorful Beauty", image: "https://source.unsplash.com/waTo4DNZ4zE"},
            {name: "Dark Azure", image: "https://source.unsplash.com/qmZF9CptLKs"},
            {name: "Green Mystic", image: "https://source.unsplash.com/mzZVGFfMOkA"},
            {name: "Colorful Beauty", image: "https://source.unsplash.com/waTo4DNZ4zE"}
            
        ];

app.get("/campgrounds", function(req, res){
        res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    //gett data from form and add to campgrounds array
    var name = req.body.name;
    var img = req.body.image;
    var newCampground = {name: name, image: img};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting server...");
});