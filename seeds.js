var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
//seeding the database (for testing)

var data =[
    {
        name: "Azure blue",
        image: "http://source.unsplash.com/B9z9TjfIw3I",
        description: "Lorem ipsum dolor sit amet, eu qui novum dicunt philosophia, has at solum platonem. Sonet propriae no quo, has accusam scribentur at. Vel apeirian antiopam inimicus at, debet legimus eos an. Ea oblique offendit has, vim tempor vivendo in, usu facer labores in. Ea cibo rationibus his. Mel vidit platonem at."
        
    },
    {
        name:"Mystic jungle",
        image:"http://source.unsplash.com/OivhEmfO-kk",
        description:"Lorem ipsum dolor sit amet, eu qui novum dicunt philosophia, has at solum platonem. Sonet propriae no quo, has accusam scribentur at. Vel apeirian antiopam inimicus at, debet legimus eos an. Ea oblique offendit has, vim tempor vivendo in, usu facer labores in. Ea cibo rationibus his. Mel vidit platonem at."
    },
    {
        name:"Playful mountain",
        image:"http://source.unsplash.com/2DH-qMX6M4E",
        description:"Lorem ipsum dolor sit amet, eu qui novum dicunt philosophia, has at solum platonem. Sonet propriae no quo, has accusam scribentur at. Vel apeirian antiopam inimicus at, debet legimus eos an. Ea oblique offendit has, vim tempor vivendo in, usu facer labores in. Ea cibo rationibus his. Mel vidit platonem at."
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
