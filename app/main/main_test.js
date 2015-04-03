'use strict';

describe('myApp.main module', function() {

  beforeEach(module('myApp.main'));

  describe('main controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var myInterviewFormCtrl = $controller('interviewFormCtrl');
      expect(myInterviewFormCtrl).toBeDefined();
    }));

  });

////

	var dataCollection;

	beforeEach(inject(function(_dataCollection_) {
		dataCollection = _dataCollection_;
	}));

	describe('fixQuestionsObj method', function() {
			var updatedCategoriesAr;

		beforeEach(function() {
			var categoriesAr = [{category: 'General Questions'}, {category: 'HTML Questions'}, {category: 'CSS Questions'}, {category: 'Javascript Questions'}, {category: 'Network Questions'}, {category: 'Coding Questions'}, {category: 'Fun Questions'}];
			updatedCategoriesAr = dataCollection.fixQuestionsObj(categoriesAr);
		});

		it('should swap the categories, Fun Questions and Coding Questions', function() {
			expect(updatedCategoriesAr[5].category.toBe('Fun Questions'));
			expect(updatedCategoriesAr[6].category.toBe('Coding Questions'));
		});

	});

});