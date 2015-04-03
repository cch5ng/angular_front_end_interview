'use strict';

describe('myApp.main module', function() {

	//var ngSanitize;
	var scope;

  beforeEach(function() {
  	module('myApp.main');
  });

  describe('main controller', function(){

    it('should ....', inject(function($controller, $rootScope) {
      //spec body
      scope = $rootScope.$new();
      var myInterviewFormCtrl = $controller('interviewFormCtrl', {$scope: scope});
      expect(myInterviewFormCtrl).toBeDefined();
    }));

  });

});
////

	describe('fixQuestionsObj method', function() {
			var DataCollectionService;

	beforeEach(function() {
  	module('myApp.main');
		inject(function($injector) { //verify this syntax for cur version of angular
			DataCollectionService = $injector.get('dataCollection');
		});
	});

		var categoriesAr = [{category: 'General Questions'}, {category: 'HTML Questions'}, {category: 'CSS Questions'}, {category: 'Javascript Questions'}, {category: 'Network Questions'}, {category: 'Coding Questions'}, {category: 'Fun Questions'}];
		var updatedCategoriesAr = DataCollectionService.fixQuestionsObj(categoriesAr); //keeps failing

		it('should swap the categories, Fun Questions and Coding Questions', function() {
			expect(updatedCategoriesAr[5].category.toBe('Fun Questions'));
			expect(updatedCategoriesAr[6].category.toBe('Coding Questions'));
		});

	});

