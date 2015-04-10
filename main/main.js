'use strict';

angular.module('myApp.main', ['ngSanitize', 'ngRoute']).
	config(['$routeProvider', function($routeProvider) {
	  $routeProvider.when('/main', {
	    templateUrl: 'main/main.html',
	    controller: 'interviewFormCtrl'
	  });
	}]).


	factory('dataCollection', ['$http', '$q', function($http, $q) {
		var deferred = $q.defer();
		var interviewUrl = '/app/src/h5bp_readme.html'; //this url for dev
		//next url for production
		//var interviewUrl =  'https://cch5ng.github.io/angular_front_end_interview/src/h5bp_readme.html';

		//helper function

		/**
		 * @param data {string} html for the page, interviewUrl
		 * returns an array of list <li> nodes, with an element for each question category
		 *
		 */
		function getCategories(data) {  //alt could get this via <h4> but drop the last one for contributors; probably <h4> is more stable than the current selector?
		  var categoryList = angular.element(data).find('ol:nth-of-type(1)'); //$(data)
		  var categoryStr = categoryList[0].innerText;//innerHTML

		  return parseList(categoryStr);
		}

		/**
		 * @param str {string}
		 * given a string in list form, returns an array of strings, with
		 *     an element for each original line (if not blank)
		 *     Note that there are some issues where there are nested lists
		 *     this will result in empty strings in the resulting array
		 */
		function parseList(str) {
		  var cleanList = [];

		  var trimmedStr = str.trim();
		  cleanList = str.split("\n");
		  cleanList = cleanList.slice(1); //removes first empty line
		  cleanList.pop(); //removes last empty line

		  return cleanList;
		}

		/**
		 * @param data {string} html for the page, interviewUrl
		 * returns an array of list <li> nodes, where each element represents
		 *     the group of questions for a category. the order of question
		 *     sets matches the order of categories from getCategories()
		 */
		function getAllQuestions(data) {
		  var allLists = angular.element(data).find('body').children('ul'); // $(data)
		  var allListsLength = allLists.length;
		  var questionsListByCategory = [];

		  for (var i = 0; i < allLists.length; i++) {
		    questionsListByCategory.push($(allLists[i]).children('li'));
		  }

		  return questionsListByCategory;
		}

		/**
		 * @param categoriesAr [[string], ...]
		 * @param questionsAr [[string], ...]
		 * returns an array of objects, where each object contains a category
		 *     and array of corresponding questions
		 */
		function buildObj(categoriesAr, questionsAr) {
		  var questionsArResult = [];
		  
		  var numCategories = categoriesAr.length;
		  var name = 'category';
		  for (var i = 0; i < numCategories; i++) {
		    var questionsObj = {};
		    questionsObj.category = categoriesAr[i];
		    questionsObj.questions = questionsAr[i];
		    questionsArResult.push(questionsObj);
		  }
		  return questionsArResult;
		}

		/**
		 * @param questionsLst [{category: 'mycat', [questions node list]}, ...]
		 * updates the array of question list sets so that the Fun Questions comes before the Coding Questions
		 *     (workaround for issue with parsing coding questions because they don't use the standard list format)
		 */
		function fixQuestionsObj(questionsLst) {
			var fixQuestionsObj = questionsLst.slice(0);
			fixQuestionsObj[5].category = 'Fun Questions';
			fixQuestionsObj[6].category = 'Coding Questions';

			return fixQuestionsObj;
		}

		/**
		 * @param data {html document} result of http get for html page with the parsed markdown (local to this project)
		 * @param questionsObj [{category: 'categ', questions: [li node list]}, {}, ...] latest version of the set of categories and 
		   		related questions 
		 * updates the array of question list sets so that the first part of coding questions is added as a node list
		 *    this is only the question without the code section
		 */
		function getCodingQuestionsPt1(data, questionsObj) {
			var updatedQuestionsObj = questionsObj.slice(0);

			var codingQuestionsList1 = angular.element(data).find('p > em'); //$(data)
			updatedQuestionsObj[6].questionsPt1 = codingQuestionsList1; //nodelist
			return updatedQuestionsObj;
		}

		/**
		 * @param data {html document} result of http get for html page with the parsed markdown (local to this project)
		 * @param questionsObj [{category: 'categ', questions: [li node list]}, {}, ...] latest version of the set of categories and 
		   		related questions 
		 * updates the array of question list sets so that the 2nd part of coding questions is added as a node list
		 *    this is only code section
		 */
		function getCodingQuestionsPt2(data, questionsObj) {
			var updatedQuestionsObj = questionsObj.slice(0);
			var trimmedQuestionsObj = [];

			var codingQuestionsList2 = angular.element(data).find('body pre > code'); //$(data)
			trimmedQuestionsObj = codingQuestionsList2.slice(1); //fixing issue where code sample from a different category was getting included
			updatedQuestionsObj[6].questionsPt2 = trimmedQuestionsObj; //nodelist
			return updatedQuestionsObj;
		}

		return {
			getQuestionsArray: function() {
				$http.get(interviewUrl , {responseType: 'document'})
					.success(function(data, status, headers) {
						var categoriesAr = getCategories(data);
					  var questionsAr = getAllQuestions(data);
					  var questionsObj = buildObj(categoriesAr, questionsAr);
					  var fixedQuestionsObj = fixQuestionsObj(questionsObj); //have to swap the order of categories (fun and coding)

					  var questionsObj2 = getCodingQuestionsPt1(data, fixedQuestionsObj); //questionsObj
					  var questionsObj3 = getCodingQuestionsPt2(data, questionsObj2);
//wonder if I should somehow differentiate between coding questions and the other types of questions since you can't iterate the same way
						deferred.resolve(questionsObj3); //not sure about this syntax
					})
					.error(function(err) {
						deferred.reject(err);
						console.log('error: ' + err);
					});
					return deferred.promise; //ask about this (why should it make a difference where you return from, under success or here?)
			}
		};
	}]).

	controller('interviewFormCtrl', ['$scope', '$q', '$location', 'dataCollection', function($scope, $q, $location, dataCollection) {
		var promise = dataCollection.getQuestionsArray();

		$scope.genCount = 0;
		$scope.htmlCount = 0;
		$scope.cssCount = 0;
		$scope.jsCount = 0;
		$scope.networkCount = 0;
		$scope.funCount = 0;
		$scope.codingCount = 0;

		promise.then(function(response) {
			$scope.questionsObj = response;
			$scope.max_num1 = $scope.questionsObj[0].questions.length;
			$scope.max_num2 = $scope.questionsObj[1].questions.length;
			$scope.max_num3 = $scope.questionsObj[2].questions.length;
			$scope.max_num4 = $scope.questionsObj[3].questions.length;
			$scope.max_num5 = $scope.questionsObj[4].questions.length;
			$scope.max_num6 = $scope.questionsObj[5].questions.length;
			$scope.max_num7 = $scope.questionsObj[6].questionsPt1.length; //note this different format from other categories
			$scope.maxNumAr = [$scope.max_num1, $scope.max_num2, $scope.max_num3, $scope.max_num4, $scope.max_num5, $scope.max_num6, $scope.max_num7];
		}, function(error) {
			console.log('error: ' + error);
		});

		//helper functions
		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		}

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

	directive('ccrQuestions', function() {
		return {
			restrict: 'E',
			templateUrl: 'main/ccr-questions.html'
		};

	}).

	directive('ccrCodingQuestions', function() {
		return {
			restrict: 'E',
			templateUrl: 'main/ccr-coding-questions.html'
		};

	});