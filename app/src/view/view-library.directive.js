//view/view-library.directive.js
;(function(){

	angular.module('app').directive('viewLibrary', directiveFactory);

	directiveFactory.$inject = ['CONFIG'];
	function directiveFactory(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.TEMPLATE_URL + 'view-library.html'
		}
	}

})();
