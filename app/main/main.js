'use strict';

angular.module('myApp.main', [])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/view1', {
//     templateUrl: 'view1/view1.html',
//     controller: 'View1Ctrl'
//   });
// }])

.factory('dataCollection', [function questionsArrayFactory() { //need $http?
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
			  //console.log(categoryList.length);
			  var categoryStr = categoryList[0].innerHTML;//innerText
			  
			  return parseList(categoryStr);
			}

			/**
			 * @param str {string}
			 * given a string in list form, returns an array of strings, with
			 *     an element for each original line (if not blank)
			 *     Note that there are some issues where there are nested lists
			 *     this will result in empty strings in the resulting array
			 */
			//TODO, this part is currently buggy; the split is breaking for the case
			//    where there is a nested list within a question
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

//TODO fix this loop so that I don't end up with a questions element that contains a single element array of another array containing the questions
			  for (var i = 0; i < allLists.length; i++) {
			    var categoryQuestionsStr = allLists[i].innerHTML;//innerText
			    var categoryQuestionsAr = [];

//TODO figure out where to read the li's innerHTML, right now if I try to push that directly, it breaks the application (browser freezes)
			    categoryQuestionsAr.push($(allLists[i]).children('li'));
			    questionsListByCategory.push(categoryQuestionsAr);
			      //questionsListByCategory.push(parseList(categoryQuestionsStr));
			  }
			  
			  //console.log(questionsListByCategory);
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
			  
			  //console.log(questionsArResult);
			  //console.log('length questionsArResult: ' + questionsArResult.length);
			  
			  return questionsArResult;
			}

				$.ajax({
				  url: interviewUrl,
				  //context: document.body,
				  dataType: 'html'
				}).done(function(data) {
				  var categoriesAr = getCategories(data);
				  var questionsAr = getAllQuestions(data);
				  var questionsObj = buildObj(categoriesAr, questionsAr);
				  //var div = document.querySelector('div.questions');
				  //var ul = document.createElement('ul');
	 
				  //ul.appendChild(getRandomGeneralQuestions(questionsObj, 5));
				  //div.appendChild(ul);
				  console.log(questionsObj);
				  return questionsObj;
	//TODO next call causes the browser to hang
				  //console.log(getRandomGeneralQuestions(questionsObj, 5));
				}).fail(function(err) {
				  console.log( "error: " + err );
				});

}])

.controller('interviewFormCtrl', ['$scope', 'dataCollection', function($scope, dataCollection) {

	$scope.dummy = 'this is dummy text';
	$scope.genCount = 0;
	$scope.htmlCount = 0;

	$scope.questionsAr = function() {
		return dataCollection.questionsArrayFactory();
	};

	console.log('length $scope.questionsAr: ' + $scope.questionsAr.length);

//stub for web scraping h5bp front end interview questions

			//TODO when I try to call this one, the browser freezes and chrome helper uses 100% cpu
//    might have broken functionality when I switched storage to innerHTML rather than innerText values
			function getRandomGeneralQuestions(questionsAr, count) {
			    var randomQuestions = [];
			    var questionIndices = [];
			    var totalGeneralQuestions = questionsAr[0].questions[0].length;
			    console.log('questionsAr[0].questions' + questionsAr[0].questions);
			    console.log('totalGeneralQuestions: ' + totalGeneralQuestions);
			    //var h4 = document.createElement('h4');
			    //h4.innerHTML = 'General Questions';
			    //var div = document.querySelector('div.questions');
			    //div.appendChild(h4);
			    console.log('Random General Questions');
 
			    for (var i = 0; i < count; i++) {
			        var randomIdx = getRandomInt(0, totalGeneralQuestions);
//TODO probably the while loop is causing the browser hang but not quite sure why
			        while (questionIndices.indexOf(randomIdx) >= 0) {
			            randomIdx = getRandomInt(0, totalGeneralQuestions);
			        }
			        questionIndices.push(randomIdx);
//TODO maybe this helps resolve browser hanging
			        var question = questionsAr[0].questions[0][randomIdx].innerHTML;
			        //var question = questionsAr[0].questions[randomIdx];
			        console.log(question);
			        randomQuestions.push(question);
			    }
			    //console.log('length randomQuestions: ' + randomQuestions.length);
			    //return randomQuestions;
			}
			 


}])

;