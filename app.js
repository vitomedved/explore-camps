var express = require("express"),
    app =express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost/explore_camps");
//passport config
app.use(require("express-session")({
    secret: "Just some basic secret h3h3",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //za main.css samo linkamo /stylesheets jer gleda u public folder

//middleware koji u svaku rutu senda currentUser da ne oramo manualno
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", {campgrounds: camps, currentUser: req.user});
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

//------------------------------------------------------------------------------
//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: camp});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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


//AUTH ROUTES -------------------------------------------------------------------------

app.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});
//show login form
app.get("/login", function(req, res) {
    res.render("login");
});
//handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", failureRedirect: "/login"
    }), function(req, res) {
    
});

//logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

//----------------------------------------------------------------------------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting server...");
});