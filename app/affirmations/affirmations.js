'use strict';

angular.module('myApp.affirmations', []).
	config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/affirmations', {
	    templateUrl: 'affirmations/affirmations.html',
	    controller: 'affirmationsCtrl'
	  });
	}]).

	controller('affirmationsCtrl', ['$scope', function($scope) {
		$scope.genCount = 0;
		$scope.htmlCount = 0;
		$scope.cssCount = 0;
		$scope.jsCount = 0;
		$scope.networkCount = 0;
		$scope.funCount = 0;
		$scope.codingCount = 0;

//may refactor this so all I do is put in the requested number of random numbers and the total number of questions
//then just get back a list of random numbers (index values for the questions list)
//that is a little simpler
		function getRandomQuestions(categoryNum, questionsCount) {
			var randomQuestionsList = [];
			var questionIndices = [];

			for (var i = 0; i < questionsCount; i++) {
	        var randomIdx = getRandomInt(0, $scope.maxNumAr[categoryNum]);
	        while (questionIndices.indexOf(randomIdx) >= 0) {
	            randomIdx = getRandomInt(0, $scope.maxNumAr[categoryNum]);
	        }
	        questionIndices.push(randomIdx);
//TODO maybe this helps resolve browser hanging
	        var question = $scope.questionsObj[categoryNum].questions[randomIdx].innerHTML;
	        randomQuestionsList.push(question);
	    }

			return randomQuestionsList;
		}

		function getRandomCodingIndices(questionsCount) {
			var questionIndices = [];

			for (var i = 0; i < questionsCount; i++) {
				var randomIdx = getRandomInt(0, $scope.max_num7);
				while (questionIndices.indexOf(randomIdx) >= 0) {
					randomIdx = getRandomInt(0, $scope.max_num7);
				}
				questionIndices.push(randomIdx);
			}

			return questionIndices;
		}

		$scope.randomQuestionsAr = function() {
			var randomQuestions = [];
			$scope.randomCodingQuestions = {};
			$scope.requestedQuestions = [$scope.genCount, $scope.htmlCount, $scope.cssCount, $scope.jsCount, $scope.networkCount, $scope.funCount, $scope.codingCount];

			for (var i = 0; i < $scope.requestedQuestions.length - 1; i++) { //processing all question categories before coding questions
				var categorySet = {};

				if ($scope.requestedQuestions[i] > 0) {
					categorySet.category = $scope.questionsObj[i].category;
					categorySet.questions = getRandomQuestions(i, $scope.requestedQuestions[i]);
					randomQuestions.push(categorySet);
				}
			}

			if ($scope.codingCount > 0) {
				$scope.randomCodingQuestions.category = $scope.questionsObj[6].category;
				var randomIndices = getRandomCodingIndices($scope.codingCount);
				var codeQuestionsList = [];

				for (var j = 0; j < randomIndices.length; j++) {
					var questionSet = [];
					questionSet.push($scope.questionsObj[6].questionsPt1[randomIndices[j]].innerHTML);
					questionSet.push($scope.questionsObj[6].questionsPt2[randomIndices[j]].innerHTML);
					codeQuestionsList.push(questionSet);
				}

				$scope.randomCodingQuestions.questions = codeQuestionsList;
			}

			$scope.randomQuestionsByCateg = randomQuestions;
		};

		$scope.clear = function() {
			$scope.genCount = 0;
			$scope.htmlCount = 0;
			$scope.cssCount = 0;
			$scope.jsCount = 0;
			$scope.networkCount = 0;
			$scope.codingCount = 0;
			$scope.funCount = 0;
			$scope.randomQuestionsByCateg = [];
			$scope.randomCodingQuestions = {};
		};

		$scope.getClass = function(path) {
	    if ($location.path().substr(0, path.length) == path) {
	      return "active"
	    } else {
	      return ""
	    }
		}

	}]).

	directive('affirmations', function() {
		return {
			restrict: 'E',
			templateUrl: 'affirmations/affirmations.html'
		};

	});