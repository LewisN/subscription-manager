//Parse keys
var PARSE_APP = "hDsnLQIJnntsfTgxiYXueyWwZ1kMFUdr0UUjyfIU";
var PARSE_JS = "fPQ2l1NVewvTdAYZihOI9y9GrPYBx7sZE3etfclZ";


//Verifies keys
Parse.initialize(PARSE_APP, PARSE_JS);

//Starts AngularJS app
angular.module('subApp', [])
	.run(['$rootScope', function ($scope) {

		//Sets first page to login and defines user
		$scope.currentUser = Parse.User.current();
		
		//Checks if user is logged in and loads relevant page on refresh
		var currentUser = Parse.User.current();
		
		var pageCheck = function () {
			if (currentUser) {
				$scope.state = 'Overview';
				console.log('User is logged in');
			} else {
				$scope.state = 'Log in';
				console.log('No user logged in');
			}
		};
		
		pageCheck();
		

		//Defining request to 'Services' table in db to be usable in all $scopes
		var Services = Parse.Object.extend("Services");
		var services = new Services();
		//Function to return service names created by user - executed on Log in
		var returnServices = function () {
			var query = new Parse.Query(Services);
			query.exists("serviceName");
			query.find({
				success: function (results) {
					//clears current list
					(function ($) {
						$("#service-table li").remove();
					})(jQuery);

					//retrives new up to date list
					for (var i = 0; i < results.length; i++) {
						var object = results[i];
						(function ($) {
							$('#service-table').append('<li class="list-group-item"><a href="#">' + object.get('serviceName') + '</a></li>');
						})(jQuery);
						//console.log(object.get('serviceName'));
					}
				},
				error: function (error) {
					alert("Error: " + error.code + " " + error.message);
				}
			});
		};

		returnServices(); //Function is called here so after login it runs again every page refresh
		
		//Logs user in
		$scope.logIn = function (form) {
			Parse.User.logIn(form.username, form.password, {
				success: function (user) {
					$scope.currentUser = user;
					$scope.$apply();
					location.reload();				
				},
				error: function (user, error) { 
					alert("Log in failed: " + error.message);
				}
			});
		};


		//Lets user register and saves account in Parse db
		$scope.signUp = function (form) {
			var user = new Parse.User();
			user.set("username", form.username);
			user.set("password", form.password);
			user.set("email", form.email);
			user.signUp(null, {
				success: function (user) {
					$scope.currentUser = user;
					$scope.$apply();
					location.reload();				
				},
				error: function (user, error) {
					alert("Sign up failed:  " + error.message);
				}
			});
		};


		//Logs current user out and goes back to login page
		$scope.logOut = function (form) {
			Parse.User.logOut();
			$scope.currentUser = null;
			$scope.state = 'Log in';
		};



		//Function to return most the single recent service added by user - executed upon adding new service
		var returnNewService = function () {
			var query = new Parse.Query(Services);
			query.exists("serviceName");
			query.limit(1);
			query.first({
				success: function (results) {
					for (var i = 0; i < results.length; i++) {
						var object = results[i];
						(function ($) {
							$('#service-table').append('<li class="list-group-item"><a href="#">' + object.get('serviceName') + '</a></li>');
						})(jQuery);
						console.log('Services returned: ' + object.get('serviceName'));
					}
				},
				error: function (error) {
					alert("Error: " + error.code + " " + error.message);
				}
			});
		};

		//Sets 'next billing date' in newSub form to today's date and adjusts for timezone
		Date.prototype.toDateInputValue = (function() {
			var local = new Date(this);
			local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
			return local.toJSON().slice(0,10);
		});
		$(document).ready( function() {
			$('#inputRenewalDate').val(new Date().toDateInputValue());
		});
		
		//Sets default value of renewal period to 1
		$(document).ready( function() {
			$('#inputRenewalPeriodMonthly').val(1);
		});
		
		
		//Adds new subscription details to Parse db
		$scope.newSub = function (form) {
			//var Services = Parse.Object.extend("Services");
			//var services = new Services();
			services.set("serviceName", form.serviceName);
			services.set("costMonthly", form.costMonthly);
			services.set("renewalPeriodMonthly", form.renewalPeriodMonthly);
			services.set("renewalDate", form.renewalDate);
			//Sets data permissions so only current user can read/write it
			services.setACL(new Parse.ACL(Parse.User.current()));
			services.save(null, {
				success: function (services) {
					console.log('New service added: ' + services.get("serviceName"));
					returnServices();
				},
				error: function (services, error) {
					alert('Failed to create new object, with error code: ' + error.message);
				}
			});
			$scope.state = 'Services';
		};


		
/*  I.1 - SWITCHES HEADER TO SMALLER VERSION - DON'T USE UNTIL MOBILE ONLY
		$(".minimiseHeader").click(function () {
			$(".jumbo-header").fadeToggle(10);
			$(".small-header").show(10);
		});

		$(".maximiseHeader").click(function () {
			$(".jumbo-header").fadeToggle(10);
			$(".small-header").hide(10);
		});
*/

	}]);