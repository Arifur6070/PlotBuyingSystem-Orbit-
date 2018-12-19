var map, marker;

function myMap() {
    let mapOptions = {
        zoom: 18,
        minZoom: 12,
        center: { lat: 37.37917, lng: -121.9498 },
        mapTypeId: google.maps.MapTypeId.HYBRID,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false,
        tilt: 45,
        styles: [
            {
                featureType: 'poi.business',
                stylers: [{visibility: 'off'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            }
          ]
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var markerIcon = {
        url: "assets/images/user-location.png",
        scaledSize: new google.maps.Size(60, 60)
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var marker = new google.maps.Marker({
                position: { lat: position.coords.latitude, lng: position.coords.longitude },
                map: map,
                title: 'Your Location',
                icon: markerIcon
            });
            map.setCenter(marker.position);
        })
    }

    google.maps.event.addListener(map, 'click', function (event) {
        if (marker && marker.setMap) marker.setMap(null);
        setMarker(event);
    });

    placesAutoComplete();
    //placePanoramicViewWindow();
}

function placesAutoComplete() {
    let input = document.getElementById('input-find');
    let searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    new google.maps.places.Autocomplete(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (0 != places.length) {
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                return place.geometry
                    ? void (place.geometry.viewport
                            ? bounds.union(place.geometry.viewport)
                            : bounds.extend(place.geometry.location))
                        : void console.log("Returned place contains no geometry");
            });
            map.fitBounds(bounds);
        }
    });
}

function getGeoPosition(event) {
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'latLng': event.latLng
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                setPanoramicView(results[0].geometry.location);
                console.log(results[0].geometry.location);
            }
        }
    });

    google.maps.event.addListener(marker, 'dragend', function (event) {
        geocoder.geocode({
            'latLng': event.latLng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    setPanoramicView(results[0].geometry.location);
                    console.log(results[0].geometry.location);
                }
            }
        });
    });
}

function setPanoramicView(position) {
    var panoView;
    var streetviewService = new google.maps.StreetViewService;
    streetviewService.getPanorama(
        { location: position },
        function (result, status) {
            if (status === 'OK') {
                panoView = result;
                console.log(result);
                panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('panorama-view'), {
                            pano: panoView.location.pano,
                            linksControl: false,
                            panControl: false,
                            enableCloseButton: false
                        }
                    );
                $(document).ready(function () {
                    $(".street-view-section").show();
                });
                map.setStreetView(panorama);

            } else {
                $(document).ready(function () {
                    $(".street-view-section").hide();
                });
                console.log("no result returned");
                panorama.setVisible(false);
            }
        });
}

function setMarkers(locations) {

        var prop, info = [], fenway = [], iconBase = 'http://maps.google.com/mapfiles/kml/pal3/';
        var infowindow = new google.maps.InfoWindow();

        let markerIcon = {
                url: "assets/resources/property.png",
                scaledSize: new google.maps.Size(60, 60)
            };

        for (var i = 0; i < locations.length; i++) {
            prop = locations[i];
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(prop.latitude), lng: parseFloat(prop.longitude)},
                map: map,
                title: prop.type,
                animation: google.maps.Animation.BOUNCE,
                icon: markerIcon
            });

            info.push(prop);
            fenway.push(marker.getPosition());

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {

                    let infoWindowContent = [
                        '<div class="container">',
                            '<div class="row">',
                                '<div class="col-sm">',
                                    '<div class="centered">',
                                        '<p>' + locations[i].id +'</p>',
                                        '<p>' + info[i].description +'</p>',
                                        '<p>' + info[i].price +'</p>',
                                    '</div>',
                                    '<div class="property-image">',
                                        '<img class="img-thumbnail" alt="Cinque Terre" width="350" height="236" src="' + "https://tryingtobalancethemadness.files.wordpress.com/2011/12/property.jpg" + '" />',
                                    '</div>',
                                '</div>',
                            '</div">',
                        '</div>'
                    ].join('');

                    infowindow.setContent(infoWindowContent);
                    infowindow.setOptions({maxWidth: 400});
                    infowindow.open(map, marker);

                    var panoView;
                    var streetviewService = new google.maps.StreetViewService;
                    streetviewService.getPanorama(
                        {location: fenway[i]},
                        function(result, status) {
                            if (status === 'OK') {
                                panoView = result;
                                console.log(result);
                                panorama = new google.maps.StreetViewPanorama(
                                        document.getElementById('pano'), { pano: panoView.location.pano }
                                    );
                                map.setStreetView(panorama);

                            } else {
                                console.log("no result returned");
                                panorama.setVisible(false);
                            }
                        });
                }
            }) (marker, i));
        }
    }
