var map;
//Show Map On webpage
var initMap = function () {
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: new google.maps.LatLng(48.3794, 31.1656)
        });
        applyMapStyles();
        viewModel.init();
    }
    catch (error) {
        alert("Check connection and come back later " + error);
    }
};

//Defining Custom Styles
var applyMapStyles = function () {
    var styleArray = [
        {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },
        {
            featureType: "road",
            stylers: [
                {visibility: "off"}
            ]
        },
        {
            featureType: "landscape",
            stylers: [
                {visibility: "on"}
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },
           ];
    map.setOptions({styles: styleArray});
};


var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();
//MODEL
var model = {
    self: this,
  locations: [
        {
            title: ko.observable("Barcelona, Spain"),
            lat: 41.3879,
            lng: 2.1699,
            isFiltered: ko.observable(true),
        },
        {
            title: ko.observable("Madrid, Spain"),
            lat: 40.4167,
            lng: -3.7003,
            isFiltered: ko.observable(true)
        },
        {
            title: ko.observable("Manchester UK"),
            lat: 53.4793,
            lng: -2.2479,
            isFiltered: ko.observable(true)
        },
        {
            title: ko.observable("Munich, Germany"),
            lat: 48.1448,
            lng: 11.558,
            isFiltered: ko.observable(true)
        },
        {
            title: ko.observable("Paris, France"),
            lat: 48.8566,
            lng: 2.3522,
            isFiltered: ko.observable(true)
        }

    ],


    //creates a marker for each location.
    addMarkers: function () {
        for (var i = 0; i < this.locations.length; i++) {
            this.locations[i].marker = this.createMarker(this.locations[i], i);
        }
    },

    //marker creation function
    createMarker: function (location) {
        var marker = new google.maps.Marker({
            title: location.title(),
            map: map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(location.lat, location.lng)
        });
    marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
        });
        return marker;
    },

    //sets all data in Model - adds markers for all locations and sets content for each marker
    init: function () {
        this.addMarkers();
    }

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker(null);
          });
        }
      }



};

// VIEW MODEL.
// Displays the list of locations on the left side of the screen
var viewModel = {

    self: this,
    locations: ko.observableArray(),

    // variable used for search/filter functionality
    searchQuery: ko.observable(''),

    //method called by KO list item from index.html when the list item is clicked.
    // it add a marker on the map.
    toggleMarker: function (location) {
        viewModel.disableMarkers();
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        location.infowindow.open(map, location.marker);
    },

    //ViewModel grabs the info from Model about locations
    fillLocations: function () {
        for (var i = 0; i < model.locations.length; i++) {
            this.locations.push(model.locations[i]);
        }
    },

    //setting all the data and applying KO bindings
    init: function () {
        model.init();
        this.fillLocations();
        ko.applyBindings(viewModel);
        viewModel.searchQuery.subscribe(this.filterItems);
    },

    //method is used for search and filter locations, KO updates the list when finds matches.
    //Markers appear and disappear when list is filtered
    filterItems: function () {
        var filter = viewModel.searchQuery().toLowerCase();

        for (var i = 0; i < model.locations.length; i++) {

            var searchedTitle = model.locations[i].title().toLowerCase();

            if (searchedTitle.indexOf(filter) > -1) {
                model.locations[i].isFiltered(true);
                model.locations[i].marker.setMap(map);
            }
            else {
                model.locations[i].isFiltered(false);
                model.locations[i].marker.setMap(null);
            }
        }
    }
};
var myerrorhandler = function(){
     alert("Unable to connect to Google Maps.");
}
