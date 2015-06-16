//view/article-library-view.directive.js
;(function(){

	angular.module('app').directive('articleLibraryView', articleLibraryViewDirective);

	articleLibraryViewDirective.$inject = ['CONFIG'];
	function articleLibraryViewDirective(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.VIEW_URL + 'article-library-view.html'
		}
	}

})();
