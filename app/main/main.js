'use strict';

angular.module('myApp.main', []).
	factory('dataCollection', ['$http', '$q', function($http, $q) {
		var deferred = $q.defer();
		var interviewUrl = 'https://h5bp.github.io/Front-end-Developer-Interview-Questions';

		//helper function
		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
		}

		/**
		 * @param data {string} html for the page, interviewUrl
		 * returns an array of list <li> nodes, with an element for each question category
		 *
		 */
		function getCategories(data) {  //alt could get this via <h4> but drop the last one for contributors; probably <h4> is more stable than the current selector?
		  var categoryList = $(data).find('ol:nth-of-type(1)');
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
		  var allLists = $(data).find('section').children('ul'); 
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

		return {
			getQuestionsArray: function() {
				$http.get(interviewUrl, {responseType: 'text'})
					.success(function(data, status, headers) {
						var categoriesAr = getCategories(data);
					  var questionsAr = getAllQuestions(data);
					  var questionsObj = buildObj(categoriesAr, questionsAr);
					  console.log(questionsObj); //here I'm getting the expected array results
						deferred.resolve(questionsObj); //not sure about this syntax
					})
					.error(function(err) {
						deferred.reject(err);
						console.log('error: ' + err);
					});
					return deferred.promise;
			}
		};
	}]).

	controller('interviewFormCtrl', ['$scope', '$q', 'dataCollection', function($scope, $q, dataCollection) {
		var promise = dataCollection.getQuestionsArray();

		promise.then(function(response) {
			$scope.questionsObj = response;
			console.log('controllers $scope.questionsObj: ' + $scope.questionsObj);
			$scope.category1 = $scope.questionsObj[0].category;
		}, function(error) {
			console.log('error: ' + error);
		});

	}]);

//////////////
// want to add this to controller
			//TODO when I try to call this one, the browser freezes and chrome helper uses 100% cpu
//    might have broken functionality when I switched storage to innerHTML rather than innerText values
			// function getRandomGeneralQuestions(questionsAr, count) {
			//     var randomQuestions = [];
			//     var questionIndices = [];
			//     var totalGeneralQuestions = questionsAr[0].questions[0].length;
			//     console.log('questionsAr[0].questions' + questionsAr[0].questions);
			//     console.log('totalGeneralQuestions: ' + totalGeneralQuestions);
			    //var h4 = document.createElement('h4');
			    //h4.innerHTML = 'General Questions';
			    //var div = document.querySelector('div.questions');
			    //div.appendChild(h4);
			    // console.log('Random General Questions');
 
			    // for (var i = 0; i < count; i++) {
			    //     var randomIdx = getRandomInt(0, totalGeneralQuestions);
			    //     while (questionIndices.indexOf(randomIdx) >= 0) {
			    //         randomIdx = getRandomInt(0, totalGeneralQuestions);
			    //     }
			    //     questionIndices.push(randomIdx);
//TODO maybe this helps resolve browser hanging
			    //     var question = questionsAr[0].questions[0][randomIdx].innerHTML;
			    //     //var question = questionsAr[0].questions[randomIdx];
			    //     console.log(question);
			    //     randomQuestions.push(question);
			    // }
			    //console.log('length randomQuestions: ' + randomQuestions.length);
			    //return randomQuestions;
			// }