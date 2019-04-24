$(document).ready(function () {

    // Get references to html elements
    var $scrapeTerm = $("#scrapeTerm");
    var $scrapeButton = $("#scrapeButton");
    var $searchTerm = $("#searchTerm");
    var $searchButton = $("#searchButton");
    var $getAllButton = $("#getAllButton");
    var $tableDiv = $("#tableDiv");

    // The searchAPI object contains methods for each kind of request we'll make
    var searchAPI = {

        getAll: function () {
            return $.ajax({
                url: "/idioms",
                type: "GET"
            });
        },

        searchTerm: function (term) {
            return $.ajax({
                url: "/idioms/search/" + term,
                type: "GET"
            });
        },

        scrapeTerm: function (term) {
            return $.ajax({
                url: "/idioms/scrape/" + term,
                type: "POST"
            });
        }

    };


    var handleScrapeSubmit = function (event) {
        event.preventDefault();

        var searchTerm = $scrapeTerm.val().trim();

        searchAPI.scrapeTerm(searchTerm).then(function (resp) {

            var data = prepareResponseForTable(resp);
            makeTable($tableDiv, data);
        });

        // Clear out scrape field
        $scrapeTerm.val("");
    };


    var handleSearchSubmit = function (event) {
        event.preventDefault();

        var searchTerm = $searchTerm.val().trim();

        searchAPI.searchTerm(searchTerm).then(function (resp) {

            var data = prepareResponseForTable(resp);
            makeTable($tableDiv, data);
        });

        // Clear out search field
        $searchTerm.val("");
    };

    var handleGetAll = function (event) {

        searchAPI.getAll()
        .then(function(resp) {
            var data = prepareResponseForTable(resp);
            makeTable($tableDiv, data);

        })
        .catch(function(err) {
            console.log(err);
        });

    };

    




    /* Utilities */
    //  Utility to make a table from aset of data ( an array of arrays )
    //  https://www.htmlgoodies.com/beyond/css/working_w_tables_using_jquery.html
    function makeTable(container, data) {
        var table = $("<table/>").addClass('table table-striped');
        $.each(data, function (rowIndex, r) {

            var row = $("<tr/>");
            $.each(r, function (colIndex, c) {
                row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
            });
            table.append(row);
        });
        return container.html(table);
    }

    //  Utility to take a response filled with idioms and make it into an array of arrays that is in a format ready for our "makeTable" utility.
    function prepareResponseForTable(response) {
        var data = [];
        data[0] = ["idiom"]; // Row header ( Add more columns if needed )

        response.forEach(function (eachIdiom) {
            //   data.push([eachIdiom._id, eachIdiom.idiom, eachIdiom.link, eachIdiom._v]);
            data.push([eachIdiom.idiom]);
        });

        return data; // Returns an array of arrays for "makeTable"
    }

    // Add event listeners
    $scrapeButton.on("click", handleScrapeSubmit);
    $searchButton.on("click", handleSearchSubmit);
    $getAllButton.on("click", handleGetAll);


    // $getAllButton.on("click", function () {
    //     $.ajax({
    //         type: "GET",
    //         url: "/idioms",
    //         // data: data,
    //         success: function (response) {
    //             console.log("getall response:");
    //             console.log(response);
    //             // response.unshift({"_id":"", "idiom":"", "link":"", "__v":""});

    //             var data = [];
    //             // data[0] = ["ID", "Title", "Meta Description", "Meta Keywords", "Categories", "Tags", "Status"];
    //             // data[0] = ["_id", "idiom", "link", "__v"];
    //             data[0] = ["idiom"];
    //             // var hitsArray = resp.hits.hits;

    //             // hitsArray.forEach(function(eachArticle) {
    //             response.forEach(function (eachIdiom) {
    //                 //   data.push([eachIdiom._id, eachIdiom.idiom, eachIdiom.link, eachIdiom.__v]);
    //                 data.push([eachIdiom.idiom]);
    //             });

    //             makeTable($("#tableDiv"), data);

    //             // makeTable($("#tableDiv"), response);
    //         }
    //         // ,
    //         // dataType: dataType
    //     });
    // });


});