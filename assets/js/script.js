var myurl =
  "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-chloe&location=jacksonville"

$.ajax({
  url: myurl,
  headers: {
    Authorization:
      "Bearer aL5BWqL_CC2re0CWpDNSw4O_ql0g3qpfPaDXcx5wfi2qB0vbs_7pguA9GFpntHLnJ9B9m4Tu3gOO7YAx4qFr-t2AVl6c4nTTFCw9AA-grjeLWMNggg-57ElgVDgmZHYx",
  },
  method: "GET",
  dataType: "json",
  success: function (data) {
    // Grab the results from the API JSON return
    var totalresults = data.total
    // If our results are greater than 0, continue
    if (totalresults > 0) {
      // Display a header on the page with the number of results
      $("#results").append(
        "<h5>We discovered " + totalresults + " results!</h5>"
      )
      // Iterate through the JSON array of 'businesses' which was returned by the API
      $.each(data.businesses, function (i, item) {
        // Store each business's object in a variable
        var id = item.id
        var alias = item.alias
        var phone = item.display_phone
        var image = item.image_url
        var name = item.name
        var rating = item.rating
        var reviewcount = item.review_count
        var address = item.location.address1
        var city = item.location.city
        var state = item.location.state
        var zipcode = item.location.zip_code
        // Append our result into our page
        $("#results").append(
          '<div id="' +
            id +
            '" style="margin-top:50px;margin-bottom:50px;"><img src="' +
            image +
            '" style="width:200px;height:150px;"><br>We found <b>' +
            name +
            "</b> (" +
            alias +
            ")<br>Business ID: " +
            id +
            "<br> Located at: " +
            address +
            " " +
            city +
            ", " +
            state +
            " " +
            zipcode +
            "<br>The phone number for this business is: " +
            phone +
            "<br>This business has a rating of " +
            rating +
            " with " +
            reviewcount +
            " reviews.</div>"
        )
      })
    } else {
      // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
      $("#results").append("<h5>We discovered no results!</h5>")
    }
  },
})
