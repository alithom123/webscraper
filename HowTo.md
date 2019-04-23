* Create directory 
* npm init
* First create a basic express app.
* touch app.js
* npm install express


```js
$ node app.js 
App listening on port 3000
```

* Add route to a basic html page. 
* Create index.html page make sure it gets served.

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <title>Search Articles</title>
  </head>
  <body>
    <h1>Search Articles</h1>

        <form class="clearfix mb-4" action="POST">
            <div class="form-group">
              <label for="search-title">Search for Titles</label>
              <textarea class="form-control" id="searchTitle" aria-describedby="search-title" placeholder="Elasticsearch on NodeJS"></textarea>
            </div>
            <button id="submitSearchTitle" class="btn btn-primary float-right">Submit</button>
    </form>

    <div id="tableDiv">
    </div>

    <script
    src="https://code.jquery.com/jquery-3.4.0.min.js"
    integrity="sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg="
    crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    <script src="/js/index.js"></script>

  </body>
</html>
```

https://i.gyazo.com/bb1f8151b26eb12c655ec9415a9350cc.png


* Add axios and cheerio
* npm install axios cheerio
* Explain both.
* Make an axios call that gets your website

https://i.gyazo.com/8397e108ade9c8280499e8aaa216b7c4.png
https://i.gyazo.com/4f79e4248540386fcb43a0364eff34d8.png

* You should see a response and a bunch of html.
* Now let's see if we can use cheerio to pull out the idioms we want. 

```js
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
    
    var $ = cheerio.load(response.data);

    var idioms = [];
    var listItems = $("ul.idiKw li a").each(function(i, elem) {
        idioms.push($(elem).text());
    });

    console.log(idioms);
});


// Start the server
app.listen(PORT, function() {
  console.log("App listening on port " + PORT);
});
```

https://i.gyazo.com/de4f2d264b17dc9e85da67a82ac69e37.png

* As you can see we have found all the idioms.
* Next we want to connect to MongoDB to store our data.  We'll try to store the results so that if two users make the same query we won't scrape the website again but instead return the stored results.  
* Install mongoose `npm install mongoose`
* Create a model folder
* Create an idioms.js file that describes the schema
* Connect to mongoose 
* Add dummy data and test.
https://i.gyazo.com/555cec7486d82dc334b9bf51aacbd077.png

* Create route to get all idioms in db.

```js 
// Route for retrieving all idioms
app.get("/idioms", function(req, res) {
    // Find all Notes
    // db.Note.find({})
    Idiom.find({})
      .then(function(dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });
  ```

  

