var map, marker;

function myMap() {
    let mapOptions = {
        zoom: 18,
        minZoom: 14,
        center: { lat: 36.964, lng: -122.015 },
        mapTypeId: google.maps.MapTypeId.HYBRID,
        minZoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false,
        tilt: 45,
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var markerIcon = {
        url: "/Resources/user-location.png",
        scaledSize: new google.maps.Size(40, 40)
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
    placePanoramicViewWindow();
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

function setMarker(location) {
    let markerIcon = {
        url: "/Resources/property.png",
        scaledSize: new google.maps.Size(40, 40)
    };

    marker = new google.maps.Marker({
        position: location.latLng,
        animation: google.maps.Animation.DROP,
        draggable: true,
        icon: markerIcon,
        animation: google.maps.Animation.BOUNCE,
        map: map
    });

    getGeoPosition(location);
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
