'use strict';

angular.module('myApp.affirmations', []).
	config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/affirmations', {
	    templateUrl: 'affirmations/affirmations.html' //,
	    //controller: 'affirmationsCtrl'
	  });
	}]).

	// controller('affirmationsCtrl', ['$scope', function($scope) {
	// }]).

	directive('affirmations', function() {
		return {
			restrict: 'E',
			templateUrl: 'affirmations/affirmations.html'
		};

	});