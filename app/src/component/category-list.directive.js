//component/category-list.directive.js
;(function(){

	angular.module('app').directive('categoryList', categoryListDirective);

	categoryListDirective.$inject = ['CONFIG'];
	function categoryListDirective(CONFIG){
		return {
			scope: {},
			require: 'categoryList',
			restrict: 'E',
			templateUrl: CONFIG.BASE_URL + 'component/category-list.html',
			link: function (scope, el, attr, selfController) {
				selfController.init();
			},
			controllerAs : 'ctrl',
			controller: categoryListController
		}
	}

	categoryListController.$inject = ['$scope','categoryFetchService'];
	function categoryListController($scope, categoryFetchService){
		var o = this;
		o.data = {};
		o.init = function () {
			categoryFetchService.exec().then(function(res){
				o.data.category = res;
			});
		}
	}

})();
