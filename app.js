var express = require("express");
// Require axios to get html of a webpage
var axios = require("axios");
// Require cheerio to allow you to scrape html page in a fashion similar to jquery
var cheerio = require("cheerio");
// Require Mongoose to store idioms in database
var mongoose = require("mongoose");


// Requiring the `Idioms` model for accessing the `idioms` collection
var Idiom = require("./models/idioms.js");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/idioms_db", { useNewUrlParser: true });

// Create dummy data to save to the database
var data = {
    idiom: "a heavy purse makes a light heart",
    link: "https://idioms.thefreedictionary.com/a+heavy+purse+makes+a+light+heart"
  };
  
  // Save a new Idiom using the data object
  Idiom.create(data)
    .then(function(savedIdiom) {
      // If saved successfully, print the new Idiom document to the console
      console.log(savedIdiom);
    })
    .catch(function(err) {
      // If an error occurs, log the error message
      console.log(err.message);
    });
  

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));



/* Test Axios with Cheerio */
axios.get("https://idioms.thefreedictionary.com/light").then(function(response) {
    
    var $ = cheerio.load(response.data);

    var idioms = [];
    var links = [];
    var listItems = $("ul.idiKw li a").each(function(i, elem) {
        idioms.push($(elem).text());
        links.push("https://thefreedictionary.com/" + $(elem).attr("href"));
    });

    // console.log(idioms);
    // console.log(links);
});

var scrape = function(searchTerm) {
    /* Test Axios with Cheerio */
    var idioms = [];
    return axios.get("https://idioms.thefreedictionary.com/" + searchTerm).then(function(response) {
    
        var $ = cheerio.load(response.data);
        
        // var links = [];
        var listItems = $("ul.idiKw li a").each(function(i, elem) {
            let obj = {
                idiom: $(elem).text(),
                link: "https://thefreedictionary.com/" + $(elem).attr("href")
            };
            // idioms.push($(elem).text());
            // links.push("https://thefreedictionary.com/" + $(elem).attr("href"));
            // console.log("in each")
            // console.log(obj)
            idioms.push(obj);
        });

        // console.log(idioms);
        return idioms;
        // console.log(links);
    });
    // console.log("OUTER");
    // console.log(idioms);
}

/* Routes */

// Simple index route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "./public/index.html"));
  });

// Route for retrieving all idioms
app.get("/idioms", function(req, res) {
    // Find all Idioms
    Idiom.find({})
      .then(function(savedIdioms) {
        // If all Idioms are successfully found, send them back to the client
        res.json(savedIdioms);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });


// Route for retrieving idioms that have an entered string
app.get("/idioms/search/:searchTerm", function(req, res) {
  Idiom.find({ "idiom": { "$regex": req.params.searchTerm, "$options": "i" } })
    .then(function(foundIdioms) {
        res.json(foundIdioms);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route to go out and scrape for idioms that have an entered string
app.get("/idioms/scrape/:searchTerm", function(req, res) {

    console.log("api");
    scrape(req.params.searchTerm)
    .then(function(foundIdioms) {
        console.log("scraped:");
        console.log(foundIdioms);
        // Save scraped Idioms
        foundIdioms.forEach(function(eachIdiom) {
            Idiom.create(eachIdiom)
            .then(function(savedIdiom) {
                // If saved successfully, print the new Idiom document to the console
                console.log(savedIdiom);
            })
            .catch(function(err) {
                // If an error occurs, log the error message
                console.log(err.message);
            });
        })
        

        res.json(foundIdioms);
    })
    .catch(function(err) {
        res.json(err);
    });

  });

  // Route to go out and scrape for idioms that have an entered string
app.get("/idioms/drop", function(req, res) {

    Idiom.deleteMany({})
    .then(function(res) {
        res.json(res)
    })
    .catch(function(err) {
        res.json(err)
    })
});


// Start the server
app.listen(PORT, function() {
  console.log("App listening on port " + PORT);
});


/*
Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://news.ycombinator.com/").then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);
      // For each element with a "title" class
      $(".title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData db
          db.scrapedData.insert({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });
    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
*/