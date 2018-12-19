 var app = angular.module("orbitAppModule", ["ngRoute", "ngStorage"]);
app.config(function($routeProvider){
    $routeProvider
        .when("/", {
            templateUrl : "home.html",
            controller : "homeController"
        })
        .when("/login", {
            templateUrl : "login.html",
            controller : "userController"
        })
        .when("/post-ad", {
            templateUrl : "post-ad.html",
            controller : "adPostController",
            resolve : {
                'auth' : function(AuthService) {
                    return AuthService.authenticate();
                }
            }
        })
        .when("/post-ad/property", {
            templateUrl : "property.html",
            controller : "adPostController",
            resolve : {
                'auth' : function(AuthService) {
                    return AuthService.authenticate();
                }
            }
        })
        .when("/profile", {
            templateUrl : "profile.html",
            controller : "profileController",
            resolve : {
                'auth' : function(AuthService) {
                    return AuthService.authenticate();
                }
            }
        })
        .when('/dashboard', {
            templateUrl : "dashboard.html",
            resolve : {
                'auth' : function(AuthService) {
                    return AuthService.authenticate();
                }
            }
        })
        .when("/logout", {
            templateUrl : "logout.html",
            controller : "userController"
        });
}).run(function($rootScope, $location){
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        console.log(rejection);
        if(rejection === 'Not Authenticated') {
            $location.path('/login');
        }
    })
});