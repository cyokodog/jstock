//view/article-list-view.directive.js
;(function(){

	angular.module('app').directive('articleListView', articleListViewDirective);

	articleListViewDirective.$inject = ['CONFIG'];
	function articleListViewDirective(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.VIEW_URL + 'article-list-view.html'
		}
	}

})();
