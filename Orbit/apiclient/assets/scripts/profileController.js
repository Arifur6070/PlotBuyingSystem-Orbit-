app.controller('profileController', [ "$scope", "$http", "AuthService", "$location", function ($scope, $http, AuthService, $location) {

		$scope.getUser = function() {
			$http({
				method: 'GET',
				url: "http://localhost:49352/api/people/" + AuthService.getUser().userId
			})
			.then(function (response) {
				if(response.status == 401) {
					alert('No Data found');
				} else {
					$scope.name = response.data.name;
					$scope.username = response.data.username;
					$scope.email = response.data.email;
					$scope.phoneNum = response.data.phoneNum;
					$scope.address = response.data.address;
				}
			});
		}
		
		$scope.updateProfile = function () {
			userDetails = {
				name : $scope.name,
				username : $scope.username,
				email : $scope.email,
				phoneNum : $scope.phoneNum,
				address : $scope.address
			};

			$http({
	            method: 'PUT',
	            headers: { Authorization: 'Basic ' + btoa(AuthService.getUser().username + ':' + AuthService.getUser().password) },
	            url: 'http://localhost:49352/api/people/' + AuthService.getUser().userId,
	            data: JSON.stringify(userDetails)
	        })
	        .then(function (response) {
	        	console.log(response.data);           	
	        }); 
		}

		$scope.newPassword = null;
		$scope.oldPassword = null;
		$scope.updatePassword = function() {
			if ($scope.oldPassword == AuthService.getUser().password) {
				console.log("correct");
				$scope.passErrTxtVisible = false;
				if ($scope.newPassword != null && ($scope.newPassword == $scope.confirmPassword)) {
					updatedInfo = {
						username : AuthService.getUser().username,
						password : $scope.newPassword
					}

					$http({
			            method: 'PUT',
			            headers: { Authorization: 'Basic ' + btoa(AuthService.getUser().username + ':' + AuthService.getUser().password) },
			            url: 'http://localhost:49352/api/users/' + AuthService.getUser().userId,
			            data: JSON.stringify(updatedInfo)
			        })
			        .then(function (response) {
			        	console.log(response.data);           	
			        }); 
			        $scope.getUser();

					$scope.passErrTxtVisible = true;
					$scope.passwordErrorText = "Password updated successfully!";
					console.log("password updated successfully!");
				} else {
					$scope.passErrTxtVisible = true;
					$scope.passwordErrorText = "Password does not match!";
					console.log("password does not match!");
				}
			} else {
				if ($scope.oldPassword == null) {
					$scope.passErrTxtVisible = true;
					$scope.passwordErrorText = "Please enter your password.";
				} else {
					$scope.passErrTxtVisible = true;
					$scope.passwordErrorText = "Incorrect password!";
				}			
			}
			
		}

}]);
