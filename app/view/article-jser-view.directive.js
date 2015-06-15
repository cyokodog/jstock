//view/article-jser-view.directive.js
;(function(){

	angular.module('app').directive('articleJserView', articleJserViewDirective);

	articleJserViewDirective.$inject = ['CONFIG'];
	function articleJserViewDirective(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.VIEW_URL + 'article-jser-view.html'
		}
	}

})();
