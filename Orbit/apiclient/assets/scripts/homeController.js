'use strict';

var marker;

app.controller('homeController', function($scope, $http, $window, $localStorage, $location, AuthService) {
	
	

	$scope.initializeMap = function() {
		let mapOptions = {
			zoom: 16,
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
    	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	    var markerIcon = {
	        url: "assets/images/user-location.png",
	        scaledSize: new google.maps.Size(40, 40)
	    };
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function (position) {
	            marker = new google.maps.Marker({
	                position: { lat: position.coords.latitude, lng: position.coords.longitude },
	                map: $scope.map,
	                title: 'Your Location',
	                icon: markerIcon
	            });
	            $scope.map.setCenter(marker.position);	            
	        })
	    }	    
	    $scope.placesAutoComplete();
	}

	$scope.placesAutoComplete = function() {
		let input = document.getElementById('input-find');
		let searchBox = new google.maps.places.SearchBox(input);

		new google.maps.places.Autocomplete(input);

		$scope.map.addListener('bounds_changed', function () {
		    searchBox.setBounds($scope.map.getBounds());
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
		        $scope.map.fitBounds(bounds);
		    }
		});
	}

	$scope.showPropertyDetails = function() {
		$scope.propertyDetailsVisible = true;
	}

	function openNav() {
        document.getElementById("mySidenav").style.width = "40%";
        document.getElementById("main").style.marginLeft = "40%";
    }

	$scope.setMarkers = function(propertyList) {
        let locations = propertyList;
        let prop; 
        let info = []; 
        let fenway = []; 
        //iconBase = 'http://maps.google.com/mapfiles/kml/pal3/';

        var markerIcon = {
	        url: "assets/images/property-home.png",
	        scaledSize: new google.maps.Size(40, 40)
	    };

        for (var i = 0; i < locations.length; i++) {
            prop = locations[i];
            marker = new google.maps.Marker({
                position: {lat: parseFloat(prop.latitude), lng: parseFloat(prop.longitude)},
                map: $scope.map,
                title: prop.address,
                animation: google.maps.Animation.BOUNCE,
                //icon: iconBase + 'icon56.png'
                icon: markerIcon
            });

            info.push(prop);
            fenway.push(marker.getPosition());
            
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {

                	$http({
						method: 'GET',
						url: "http://localhost:49352/api/people/" + info[i].ownerId
					})
					.then(function (response) {
						$scope.contactDetails = {
							'name' : response.data.name,
							'email' : response.data.email,
							'phoneNum' : response.data.phoneNum
						}
					});

					switch(info[i].categoryId) {
					    case 1:					        
					        $scope.propCategory = "Price";
					        $scope.propValText = " TK";
					        break;
					    case 2:
					        $scope.propCategory = "Rent";
					        $scope.propValText = " TK / month";
					        break;
					    default:
					        $scope.propCategory = "";
					        $scope.outweigh = "";
					}

                	console.log(info[i]);
            		$scope.categoryId = info[i].categoryId;
                	$scope.type = info[i].type;

					var date = info[i].datePosted.split('T');
					var postedOn = date[0].split('-');
					var postedOn = new Date(postedOn[0], postedOn[1]-1, postedOn[2]);

					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1; //January is 0!
					var yyyy = today.getFullYear();

					if(dd<10) {
						dd = '0'+dd
					} 

					if(mm<10) {
						mm = '0'+mm
					} 
					var currentDate = new Date(yyyy, mm-1, dd);
					var myDate = Math.round((currentDate-postedOn)/(1000*60*60*24));

					switch(myDate) {
						case 0:
							$scope.datePosted = "Today";
							break;
						case 1:
							$scope.datePosted = "Yesterday";
							break;
						default: 
							$scope.datePosted = myDate + " days ago";
					}              	

					switch($scope.propertyType) {
					    case "apartments":
					    	console.log(info[i].id);					        
					        $http({
								method: 'GET',
								url: "http://localhost:49352/api/apartments/" + info[i].id
							})
							.then(function (response) {
								$scope.apartmentDetails = response.data;	
							});
					        break;
					    case "houses":
					        $http({
								method: 'GET',
								url: "http://localhost:49352/api/houses?propertyId=" + info[i].id
							})
							.then(function (response) {
								console.log(response);						
							});
					        break;
					    default:
					        //DEFAULT DATA
					}

                	openNav();
                    var panoView;
                    var streetviewService = new google.maps.StreetViewService;
                    streetviewService.getPanorama(
                        {location: fenway[i]},
                        function(result, status) {
                            if (status === 'OK') {
                                panoView = result;                                
                                var panorama = new google.maps.StreetViewPanorama(
                                        document.getElementById('pano'), { pano: panoView.location.pano }
                                    );
                                $scope.map.setStreetView(panorama);

                            } else {                               
                                console.log("no result returned");
                                panorama.setVisible(false);
                            }
                        });

                }
            }) (marker, i));
        }
    }

	$scope.searchProperties = function() {
		$scope.initializeMap();

		console.log($scope.categoryId);

		if ($scope.propertyType) {
			$http({
				method: 'GET',
				url: "http://localhost:49352/api/" + $scope.propertyType
			})
			.then(function (response) {
				$scope.setMarkers(response.data);				
			});
		} 
		if ($scope.propertyType && $scope.categoryId) {
			$http({
				method: 'GET',
				url: "http://localhost:49352/api/categories/" + $scope.categoryId + "/" + $scope.propertyType
			})
			.then(function (response) {
				console.log(response.data);
				$scope.setMarkers(response.data);				
			});
		}
	}


		if ($localStorage.isAuthenticated) {
			$scope.dashboardLinkVisible = true;
			$scope.link = "logout";
			$scope.isLoggedIn = "Logout";
		} else {
			$scope.dashboardLinkVisible = false;
			$scope.postAdLinkVisible = false;
			$scope.isLoggedIn = "Login";
			$scope.link = "login";
		}

});


