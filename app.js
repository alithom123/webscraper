var express = require("express");
// Require axios to get html of a webpage
var axios = require("axios");
// Require cheerio to allow you to scrape html page in a fashion similar to jquery
var cheerio = require("cheerio");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Routes
// ======

// Simple index route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "./public/index.html"));
  });

axios.get("https://idioms.thefreedictionary.com/light").then(function(response) {
    // console.log(response);
    var $ = cheerio.load(response.data);

    // var listItems = $("ul.idiKw").find("a").attr("href");

    var idioms = [];
    var listItems = $("ul.idiKw li a").each(function(i, elem) {
        console.log($(elem).text());
        idioms.push($(elem).text());
    });

    // .each(function(i, elem) {
    //     fruits[i] = $(this).text();
    //   });

    console.log(idioms);

    // console.log(listItems);
    // $(".idiKw").each(function(i, element) {
    // }
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