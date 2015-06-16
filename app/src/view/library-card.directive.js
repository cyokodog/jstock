//view/library-card.directive.js
;(function(){

	angular.module('app').directive('libraryCard', libraryCardDirective);

	libraryCardDirective.$inject = ['CONFIG'];
	function libraryCardDirective(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.VIEW_URL + 'library-card.html'
		}
	}
})();
