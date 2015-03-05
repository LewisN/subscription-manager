//Parse keys
var PARSE_APP = "hDsnLQIJnntsfTgxiYXueyWwZ1kMFUdr0UUjyfIU";
var PARSE_JS = "fPQ2l1NVewvTdAYZihOI9y9GrPYBx7sZE3etfclZ";

//Verifies keys
Parse.initialize(PARSE_APP, PARSE_JS);

//Starts AngularJS app
angular.module('subApp', [])
	.run(['$rootScope', function ($scope) {

		//Sets first page to login and defines user
		$scope.state = 'Log in';
		$scope.currentUser = Parse.User.current();

		//Logs user in
		$scope.logIn = function (form) {
			Parse.User.logIn(form.username, form.password, {
				success: function (user) {
					$scope.currentUser = user;
					$scope.$apply();
					$scope.state = 'Overview';
				},
				error: function (user, error) {
					alert("Unable to log in: " + error.message);
				}
			});
		};

		//Lets user register and saves account in Parse db
		$scope.signUp = function (form) {
			var user = new Parse.User();
			user.set("email", form.email);
			user.set("username", form.username);
			user.set("password", form.password);

			user.signUp(null, {
				success: function (user) {
					$scope.currentUser = user;
					$scope.$apply();
				},
				error: function (user, error) {
					alert("Unable to sign up:  " + error.message);
				}
			});
		};

		//Logs current user out and goes back to login page
		$scope.logOut = function (form) {
			Parse.User.logOut();
			$scope.currentUser = null;
			$scope.state = 'Log in';
		};

		//Adds new subscription details to Parse db
		$scope.newSub = function (form) {
			var Services = Parse.Object.extend("Services");
			var services = new Services();
			services.set("serviceName", form.serviceName);
			services.set("costMonthly", form.costMonthly);
			services.set("renewalPeriodMonthly", form.renewalPeriodMonthly);
			services.set("renewalDate", form.renewalDate);
			//Sets data permissions so only current user can read/write it
			services.setACL(new Parse.ACL(Parse.User.current()));
			services.save(null, {
				success: function (services) {
					//alert('New service added: ' + services.serviceName);
				},
				error: function (services, error) {
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
			$scope.state = 'Services';

			
		};






	}]);