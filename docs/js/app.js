//global variable;
var map;

//function removes unnecessary style/POI from the map
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

//Map Display
var initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: new google.maps.LatLng(48.3794, 31.1656),
        });
        applyMapStyles();
        viewModel.init();
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

    //before activating a marker on the map, all the other markers should be deactivated
    disableMarkers: function () {
        for (var i = 0; i < this.locations().length; i++) {
            this.locations()[i].marker.setAnimation(null);
            this.locations()[i].infowindow.close();
        }
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

//List of top Euro Teams
var model = {
    self: this,
    locations: [
        {
            title: ko.observable("Barcelona, Spain"),
            lat: 41.3879,
            lng: 2.1699,
            isFiltered: ko.observable(true),
            Url:"https://en.wikipedia.org/wiki/Manchester_United_F.C."
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

    //adds marker animation - bouncing feature, when the marker is clicked
    toggleBounce: function (location) {
        viewModel.disableMarkers();
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
    },

    //marker creation function
    createMarker: function (location) {
        var marker = new google.maps.Marker({
            title: location.title(),
            map: map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(location.lat, location.lng)
        });
        marker.addListener('click', function () {
            model.toggleBounce(location);
            location.infowindow.open(map, marker);
        });
        return marker;
    },

    //sets all data in Model - adds markers for all locations and sets content for each marker
    init: function () {
        this.addMarkers();
        this.setContent();
    }
};
