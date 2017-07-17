var express = require("express"),
    app =express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    
    seedDB = require("./seeds"),
    
    commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");

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

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //za main.css samo linkamo /stylesheets jer gleda u public folder

//middleware koji u svaku rutu senda currentUser da ne oramo manualno
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes); // appenda /campgrounds ispred svih ruta u campground routes

//seeding database
seedDB;

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Starting server...");
});