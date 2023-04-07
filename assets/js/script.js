let city = "Nashville";
var map;

async function getYelpData(yelpURL) {
  try {
    var baseURL = "https://yelp-server-caleb-crum.herokuapp.com/api?url=";
    var url = baseURL + encodeURIComponent(yelpURL);

    var res = await fetch(url);
    // console.log(res);
    var data = await res.json();
    // console.log(data);

    handleAPICall(data.businesses);
  } catch (err) {
    console.log(err);
  }
}

function handleAPICall(input) {
  for (let i = 0; i < input.length; i++) {
    let priceText = `${input[i].price}`
    if (priceText == 'undefined')
      priceText = 'N/A'
    // console.log(input[i].name);
    // console.log(input[i].display_phone);
    // console.log(input[i].price);
    // console.log(input[i].rating);
    // console.log(input[i].review_count);
    // console.log(input[i].location.display_address[0]);
    // console.log(input[i].location.display_address[1]);
    // console.log(input[i].image_url);
    $("#cards").append(
      `
      
        <div class="col s12 m4 l3 xl2" style="min-height: 473.5px;">
          <div class="card">
            <div class="card-image">
              <img style="max-height: 190px; min-height: 190px; object-fit: cover; height: auto;" src="${input[i].image_url}">
              <span class="card-title" style="text-shadow: 2px 2px 2px rgba(0,0,0,0.3); font-weight: normal;">${input[i].name}</span>
            </div>
            <div class="card-content">
                <ul>
                  <li style="font-size: 20px;">Price: ${priceText}</li>
                  <li style="font-size: 20px;">Rating: ${input[i].rating} <i class="material-icons md-18">star_rate</i></li>
                  <li style="font-size: 15px;">${input[i].review_count} reviews</li>
                </ul>
            </div>
            <div class="card-action" style="min-height: 100.5px;">
              <a href="#">${input[i].display_phone}</a> <br>
              <a class="restaurant-address" href="#">${input[i].location.display_address[0]} ${input[i].location.display_address[1]}</a>
            </div>
          </div>
        </div>`
    );
  }

  const restaurantAddress = document.querySelectorAll(".restaurant-address");
  restaurantAddress.forEach(function (address, i) {
    address.addEventListener("click", function (event) {
      event.preventDefault();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address: address.textContent },
        function (results, status) {
          if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            });
          } else {
            alert(
              "Geocode was not successful for the following reason: " + status
            );
          }
        }
      );
    });
  });
}

var nashville = { lat: 36.1627, lng: -86.7816 };

// Adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: nashville,
    zoom: 12,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });
  let markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    $('#cards').html(``);
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      console.log(place.name);
      var cityName = `${place.name}`;
      getYelpData(
        "https://api.yelp.com/v3/businesses/search?location=" +
          cityName +
          "&term=restaurants&sort_by=best_match"
      );
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

window.initAutocomplete = initAutocomplete;
