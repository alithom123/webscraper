
$(document).ready(function () {

    // Get references to page elements
    var $scrapeTerm = $("#scrapeTerm");
    var $scrapeButton = $("#scrapeButton");
    var $searchTerm = $("#searchTerm");
    var $searchButton = $("#searchButton");
    var $getAllButton = $("#getAllButton");
    var $logs = $("#log");

    console.log($getAllButton);
    
    
    // The searchAPI object contains methods for each kind of request we'll make
    var searchAPI = {

        getAll: function() {
            return $.ajax({
                // url: "http://localhost:3000/" + term,
                url: "/",
                type: "GET"
            });
        },

        searchTerm: function(term) {
            return $.ajax({
            //   url: "http://localhost:3000/idioms/search/" + term,
              url: "/idioms/search/" + term,
              type: "GET"
            });
        },

        scrapeTerm: function(term) {
          return $.ajax({
            // url: "http://localhost:3000/idioms/scrape/" + term,
            url: "/idioms/scrape/" + term,
            type: "POST"
          });
        }
    };
    
    
    var handleScrapeSubmit =  function(event) {
        console.log("handling scrape submit");
        event.preventDefault();
    
        var searchTerm = $scrapeTerm.val().trim();
    
        searchAPI.scrapeTerm(searchTerm).then(function(resp) {
    
            var data = [];
            // data[0] = ["ID", "Title", "Meta Description", "Meta Keywords", "Categories", "Tags", "Status"];
            // data[0] = ["_id", "idiom", "link", "__v"];
            data[0] = ["idiom"];
            // var hitsArray = resp.hits.hits;

            // hitsArray.forEach(function(eachArticle) {
            resp.forEach(function(eachIdiom) {
            //   data.push([eachIdiom._id, eachIdiom.idiom, eachIdiom.link, eachIdiom._v]);
              data.push([eachIdiom.idiom]);
            });
    
              var articlesTable = makeTable($("#tableDiv"), data);
        });
      
        // Clear out search field
        $scrapeTerm.val("");
      };
    

      var handleSearchSubmit =  function(event) {
        console.log("handling search submit");
        event.preventDefault();
    
        var searchTerm = $searchTerm.val().trim();
    
        searchAPI.searchTerm(searchTerm).then(function(resp) {
    
            var data = [];
            // data[0] = ["ID", "Title", "Meta Description", "Meta Keywords", "Categories", "Tags", "Status"];
            // data[0] = ["_id", "idiom", "link", "__v"];
            data[0] = ["idiom"];
            // var hitsArray = resp.hits.hits;

            // hitsArray.forEach(function(eachArticle) {
            resp.forEach(function(eachIdiom) {
            //   data.push([eachIdiom._id, eachIdiom.idiom, eachIdiom.link, eachIdiom._v]);
              data.push([eachIdiom.idiom]);
            });
    
            makeTable($("#tableDiv"), data);
        });
      
        // Clear out search field
        $searchTerm.val("");
      };
    


      /* Utilities */
    
      function makeTable(container, data) {
        var table = $("<table/>").addClass('table table-striped');
        $.each(data, function(rowIndex, r) {
    
            var row = $("<tr/>");
            $.each(r, function(colIndex, c) { 
                row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
            });
            table.append(row);
        });
        return container.html(table);
    }
    
    
    
    
    
    // Add event listeners
    $scrapeButton.on("click", handleScrapeSubmit);
    $searchButton.on("click", handleSearchSubmit);
    

    $getAllButton.on("click", function() {
        $.ajax({
            type: "GET",
            url: "/idioms",
            // data: data,
            success: function(response) {
                console.log("getall response:");
                console.log(response);
                // response.unshift({"_id":"", "idiom":"", "link":"", "__v":""});

                var data = [];
                // data[0] = ["ID", "Title", "Meta Description", "Meta Keywords", "Categories", "Tags", "Status"];
                // data[0] = ["_id", "idiom", "link", "__v"];
                data[0] = ["idiom"];
                // var hitsArray = resp.hits.hits;
    
                // hitsArray.forEach(function(eachArticle) {
                response.forEach(function(eachIdiom) {
                //   data.push([eachIdiom._id, eachIdiom.idiom, eachIdiom.link, eachIdiom.__v]);
                  data.push([eachIdiom.idiom]);
                });
        
                makeTable($("#tableDiv"), data);

                // makeTable($("#tableDiv"), response);
            }
            // ,
            // dataType: dataType
       });
    });


});