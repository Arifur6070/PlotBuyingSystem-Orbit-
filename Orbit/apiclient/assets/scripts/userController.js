app.controller('userController', [ "$scope", "$http", "AuthService", "$location", function ($scope, $http, AuthService, $location, $window, $localStorage) {
	$scope.login = function () {
		$http.get('http://localhost:49352/api/users?username=' + $scope.username + '&password=' + $scope.password, {
			headers: {Authorization: 'Basic ' + btoa($scope.username + ':' + $scope.password)}
		})
		.then(function(response) {
			console.log(response.data);
			console.log(response.status.statusText);
			if(response.status == 401) {
				console.log("Invalid username or password!");
			} else {
				var user = {
					userId : response.data.id,
					username : response.data.username,
					password : response.data.password
				}
				AuthService.setUser(user);	
				location.reload(); 			
				$location.path("/post-ad");
			}
		});
	};

	$scope.logout = function() {		
		localStorage.clear();
		location.reload(); 
		$location.path("/");
		console.log("logout successful");
	}
}]);

app.factory('AuthService', function($q, $localStorage) {
	isAuthenticated = false;
    return {
    	setUser : function(aUser) {
			$localStorage.user = aUser;
			$localStorage.isAuthenticated = true;
		},
		getUser : function() {
			return $localStorage.user;
		},
        authenticate : function() {
            if($localStorage.isAuthenticated){
                return true;
            } else {
                return $q.reject('Not Authenticated');
            }
        }
    }
});