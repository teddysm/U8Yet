let city = "Nashville"

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

function handleAPICall(input){
  for (let i = 0; i < 1; i++){
     // console.log(input[i].name);
    // console.log(input[i].display_phone);
    // console.log(input[i].price);
    // console.log(input[i].rating);
    // console.log(input[i].review_count);
    // console.log(input[i].location.display_address[0]);
    // console.log(input[i].location.display_address[1]);
    // console.log(input[i].image_url);
    $('#cards').html(
      `
      <div class="row">
        <div class="col s2 m2">
          <div class="card">
            <div class="card-image">
              <img src="${input[i].image_url}">
              <span class="card-title">${input[i].name}</span>
            </div>
            <div class="card-content">
                <ul>
                  <li>price:
                  ${input[i].price}</li>
                  <li>rating: ${input[i].rating}</li>
                  <li>review count: ${input[i].review_count}</li>
                  <li>address: ${input[i].location.display_address[0]}</li>
                </ul>
            </div>
            <div class="card-action">
              <a href="#">${input[i].display_phone}</a>
            </div>
          </div>
        </div>
      </div>`
    )
  }
}


/* getYelpData(

/* getYelpData(
  "https://api.yelp.com/v3/businesses/search?location=" + city + "&term=restaurants&sort_by=best_match"
);
 */
var nashville = {lat:36.1627, lng:-86.7816}

// Adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: nashville,
    zoom: 12,
    mapTypeId: "roadmap"
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  /* map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); */
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
    markers.forEach(marker => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      console.log(place.name);
      var cityName = `${place.name}`
      getYelpData(
        "https://api.yelp.com/v3/businesses/search?location=" + cityName + "&term=restaurants&sort_by=best_match"
      );
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location
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