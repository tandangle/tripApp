var map, places, infoWindow;
var hostnameRegexp = new RegExp('^https?://.+?/');
      
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.850033, lng: -87.6500523},
    zoom: 3,
    mapTypeId: 'roadmap'
  });
  
  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });
  
  places = new google.maps.places.PlacesService(map);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      google.maps.event.clearListeners(marker, 'click');
      marker.setMap(null);
    });
    markers = [];

    var results = document.getElementById('results');
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    var count = 0;
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var results = document.getElementById('results');
      var tr = document.createElement('tr');
      var title = document.createElement('tr');
      var icon = document.createElement('img');
      var firstPhoto = place.photos[0];
      var photo = document.createElement('img');
      photo.classList.add('photo');
      photo.src = firstPhoto.getUrl();
      var name = document.createTextNode(place.name);
      title.appendChild(name);
      tr.appendChild(title);
      tr.appendChild(photo);
      results.appendChild(tr);

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
      }));
      
      markers[count].placeResult = place;
      
      google.maps.event.addListener(markers[count], 'click', showInfoWindow);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      
      count++;
    });
    map.fitBounds(bounds);
  });
}

function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="placeIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
  document.getElementById("save").setAttribute("action", `/map/travel_list/${place.place_id}`)
  // document.getElementById("save").submit(function(e){
  //   e.preventDefault();
  // })
}