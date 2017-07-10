var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
//seeding the database (for testing)

var data =[
    {
        name: "Azure blue",
        image: "http://source.unsplash.com/B9z9TjfIw3I",
        description: "Beautiful native American campground"
        
    },
    {
        name:"Mystic jungle",
        image:"http://source.unsplash.com/OivhEmfO-kk",
        description:"Feel the forest growing in you"
    },
    {
        name:"Playful mountain",
        image:"http://source.unsplash.com/2DH-qMX6M4E",
        description:"Amazing view on the city from a foresty-mountain"
    }
]
    
function seedDB(){
    //remove all campgrounds
   Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Removed campgrounds");
        //add few camps
        data.forEach(function(seed){
            Campground.create(seed, function(err, camp){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added " + camp.name);
                    //create comment
                    Comment.create(
                        {
                            text: "This place is great but, I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                camp.comments.push(comment);
                                camp.save();
                                console.log("Created a new comment, author: " + comment.author);
                            }
                        });
                }
            });
        });
    }
    });
    
    //add few comments
}

module.exports = seedDB();
