//Parse related keys
var PARSE_APP = "hDsnLQIJnntsfTgxiYXueyWwZ1kMFUdr0UUjyfIU";
var PARSE_JS = "fPQ2l1NVewvTdAYZihOI9y9GrPYBx7sZE3etfclZ";

//User reg code: http://popdevelop.com/2013/11/parse-com-and-angularjs-for-easy-setup-of-user-authentication/

	Parse.initialize(PARSE_APP, PARSE_JS);

angular.module('subApp', [])
	.run(['$rootScope', function($scope) {
		$scope.page = 'Log in';
		$scope.currentUser = Parse.User.current();

		$scope.signUp = function(form) {
			var user = new Parse.User();
			user.set("email", form.email);
			user.set("username", form.username);
			user.set("password", form.password);

			user.signUp(null, {
				success: function(user) {
					$scope.currentUser = user;
					$scope.$apply();
				},
				error: function(user, error) {
					alert("Unable to sign up:  " + error.message);
				}
			});    
		};

		$scope.logIn = function(form) {
			Parse.User.logIn(form.username, form.password, {
				success: function(user) {
					$scope.currentUser = user;
					$scope.$apply();
				},
				error: function(user, error) {
					alert("Unable to log in: " + error.message);
				}
			});
		};

		$scope.logOut = function(form) {
			Parse.User.logOut();
			$scope.currentUser = null;
		};
	}]);
