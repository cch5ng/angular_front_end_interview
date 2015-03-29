'use strict';

angular.module('myApp.main', ['ngSanitize']).
	factory('dataCollection', ['$http', '$q', function($http, $q) {
		var deferred = $q.defer();
		var interviewUrl = '/app/src/h5bp_readme.html';
		//var interviewUrl = 'https://h5bp.github.io/Front-end-Developer-Interview-Questions';//
		//var interviewUrl =  'https://cch5ng.github.io/angular_front_end_interview/h5bp_readme.html';//'https://h5bp.github.io/Front-end-Developer-Interview-Questions';

		//helper function

		/**
		 * @param data {string} html for the page, interviewUrl
		 * returns an array of list <li> nodes, with an element for each question category
		 *
		 */
		function getCategories(data) {  //alt could get this via <h4> but drop the last one for contributors; probably <h4> is more stable than the current selector?
		  console.log('data: ' + data);
		  console.log('data.documentElement: ' + data.documentElement);
		  //console.log('length data: ' + data.length);
		  //console.log(typeof data);
		  //var categoryList = data.querySelector('ol');
		  var categoryList = $(data).find('ol:nth-of-type(1)');
		  console.log('categoryList: ' + categoryList);
		  var categoryStr = categoryList[0].innerText;//innerHTML
		  console.log('categoryStr: ' + categoryStr);

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
		  
		  //console.log(str);
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
		  var allLists = $(data).find('ul'); //find('body').children('ul'); // 
		  console.log('allLists: ' + allLists);
		  console.log(allLists[0].innerHTML);
		  //var allListsLength = allLists.length;
		  console.log('allListsLength: ' + allListsLength);
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

		return {
			getQuestionsArray: function() {
				$http.get(interviewUrl , {responseType: 'document'})
					.success(function(data, status, headers) {
						var categoriesAr = getCategories(data);
					  var questionsAr = getAllQuestions(data);
					  var questionsObj = buildObj(categoriesAr, questionsAr);
					  console.log(questionsObj);
						deferred.resolve(questionsObj); //not sure about this syntax
					})
					.error(function(err) {
						deferred.reject(err);
						console.log('error: ' + err);
					});
					return deferred.promise; //ask about this (why should it make a difference where you return from, under success or here?)
			}
		};
	}]).

	controller('interviewFormCtrl', ['$scope', '$q', 'dataCollection', function($scope, $q, dataCollection) {
		var promise = dataCollection.getQuestionsArray();

		$scope.genCount = 0;
		$scope.htmlCount = 0;
		$scope.cssCount = 0;
		$scope.jsCount = 0;
		$scope.jqueryCount = 0;
		$scope.codingCount = 0;
		$scope.funCount = 0;

		promise.then(function(response) {
			$scope.questionsObj = response;
			console.log('controllers $scope.questionsObj: ' + $scope.questionsObj);
			$scope.max_num1 = $scope.questionsObj[0].questions.length;
			$scope.max_num2 = $scope.questionsObj[1].questions.length;
			$scope.max_num3 = $scope.questionsObj[2].questions.length;
			$scope.max_num4 = $scope.questionsObj[3].questions.length;
			$scope.max_num5 = $scope.questionsObj[4].questions.length;
			$scope.max_num6 = $scope.questionsObj[5].questions.length;
			$scope.max_num7 = $scope.questionsObj[6].questions.length;
			$scope.maxNumAr = [$scope.max_num1, $scope.max_num2, $scope.max_num3, $scope.max_num4, $scope.max_num5, $scope.max_num6, $scope.max_num7];
		}, function(error) {
			console.log('error: ' + error);
		});

		//helper functions
		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		}

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
	        //var question = questionsAr[0].questions[randomIdx];
	        console.log(question);
	        randomQuestionsList.push(question);
	    }

			return randomQuestionsList;
		}

		$scope.randomQuestionsAr = function() {
			var randomQuestions = [];
			$scope.requestedQuestions = [$scope.genCount, $scope.htmlCount, $scope.cssCount, $scope.jsCount, $scope.jqueryCount, $scope.codingCount, $scope.funCount];
			console.log('length $scope.requestedQuestions: ' + $scope.requestedQuestions.length);

			for (var i = 0; i < $scope.requestedQuestions.length; i++) {
				var categorySet = {};

				console.log('$scope.requestedQuestions[i]: ' + $scope.requestedQuestions[i]);

				if ($scope.requestedQuestions[i] > 0) {
					console.log('entered this loop');
					categorySet.category = $scope.questionsObj[i].category;
					console.log('categorySet.category: ' + categorySet.category);
					categorySet.questions = getRandomQuestions(i, $scope.requestedQuestions[i]);
					console.log('categorySet.questions: ' + categorySet.questions);
					randomQuestions.push(categorySet);
				}
			}

			//console.log('categorySet: ' + $scope.categorySet);
			console.log('randomQuestions: ' + randomQuestions);
			$scope.randomQuestionsByCateg = randomQuestions;
		};

		$scope.clear = function() {
			$scope.genCount = 0;
			$scope.htmlCount = 0;
			$scope.cssCount = 0;
			$scope.jsCount = 0;
			$scope.jqueryCount = 0;
			$scope.codingCount = 0;
			$scope.funCount = 0;
			$scope.randomQuestionsByCateg = [];
		};

	}]).

	directive('ccrQuestions', function() {
		return {
			restrict: 'E',
			templateUrl: 'ccr-questions.html'
		};

	});