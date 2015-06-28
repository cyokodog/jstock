//view/card-library.directive.js
;(function(){

	angular.module('app').directive('cardLibrary', directiveFactory);

	directiveFactory.$inject = ['CONFIG'];
	function directiveFactory(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.TEMPLATE_URL + 'card-library.html'
		}
	}
})();
