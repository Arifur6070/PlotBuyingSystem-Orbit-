var map, marker;

app.controller('adPostController', ["$scope", "$http", "$window", "$localStorage", "AuthService", function($scope, $http, $window, $localStorage, AuthService, $location) {

	$scope.propertyCategoryVisible = true;

	$scope.weigh = null;
	$scope.propertyType = null;

	$scope.getCategories = function() {
		$http({
			method: 'GET',
			url: "http://localhost:49352/api/categories/",
			headers: {Authorization: 'Basic ' + btoa(AuthService.getUser().username + ':' + AuthService.getUser().password)}
		})
		.then(function (response) {
			$scope.categories = response.data;
		});
	}

	$scope.username = $localStorage.user.username;
	
	$scope.initializeMap = function() {
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
	        $scope.setMarker(event);
	    });
		$scope.placesAutoComplete();
	}

	$scope.placesAutoComplete = function() {
		let input = document.getElementById('input-find');
		let searchBox = new google.maps.places.SearchBox(input);

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

	$scope.setMarker = function(location) {
	    let markerIcon = {
	        url: "assets/images/property-home.png",
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

	    $scope.getGeoPosition(location);
	}

	$scope.getGeoPosition = function(event) {
	    let geocoder = new google.maps.Geocoder();

	    geocoder.geocode({
	        'latLng': event.latLng
	    }, function (results, status) {
	        if (status == google.maps.GeocoderStatus.OK) {
	            if (results[0]) {	            	
	                $scope.location = results[0].formatted_address;
	                $scope.latitude = results[0].geometry.location.lat(); 
	                $scope.longitude = results[0].geometry.location.lng(); 
	                $scope.setPanoramicView(results[0].geometry.location);
	            }
	        }
	    });

	    google.maps.event.addListener(marker, 'dragend', function (event) {
	        geocoder.geocode({
	            'latLng': event.latLng
	        }, function (results, status) {
	            if (status == google.maps.GeocoderStatus.OK) {
	                if (results[0]) {
	                    $scope.location = results[0].formatted_address;
		                $scope.latitude = results[0].geometry.location.lat(); 
		                $scope.longitude = results[0].geometry.location.lng(); 
		                $scope.setPanoramicView(results[0].geometry.location);
	                }
	            }
	        });
	    });
	}

	$scope.setPanoramicView = function(position) {
	    var panoView;
	    var streetviewService = new google.maps.StreetViewService;

	    streetviewService.getPanorama({ 
	        	location: position 
	        },
	        function (result, status) {
	            if (status === 'OK') {
	                panoView = result;

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

	$scope.setCategory = function(obj) {		
		$scope.categoryId = obj.target.attributes.data.value;
		$scope.propertyCategoryVisible = false;
		$scope.propertyLocationVisible = true;
		
		switch($scope.categoryId) {
			case "1":
				$scope.weighMessage = "Enter Your Price";
				break;
			case "2":
				$scope.weighMessage = "Enter Your Rent Per Month Basis";
				break;
			default:
				//
		}
	}

	$scope.setLocation = function() {
		$scope.propertyLocationVisible = false;
		switch($scope.propertyType) {
			case "apartment":
				$scope.apartmentDescriptionVisible = true;
				break;
			default:
			 	//
		} 

		$scope.propertyCategoryConfirmVisible = true;
		$scope.propertyLocationConfirmVisible = true; 
	}

	$scope.postAd = function() {
		switch($scope.propertyType) {
			case "apartment": 
				apartmentDetails = {
					"ownerId": $localStorage.user.userId,
					"categoryId": $scope.categoryId,
					"size": $scope.size,
					"bedrooms": $scope.numOfBedrooms,
					"bathrooms": $scope.numOfBathrooms,
				    "latitude": $scope.latitude,
				    "longitude": $scope.longitude,
				    "address": $scope.location,
				    "description": $scope.description
				}
				console.log(apartmentDetails);

				$http({
		            method: 'POST',
		            headers: {Authorization: 'Basic ' + btoa(AuthService.getUser().username + ':' + AuthService.getUser().password)},
		            url: 'http://localhost:49352/api/apartments',
		            data: JSON.stringify(apartmentDetails)
		        })
		        .then(function (response) {
		            console.log(response);
		            $window.location.href = '#!';
		        });

		        $scope = $scope.$new(true);
		        propertyDetails = null;

			break;
		}
	}

}]);


