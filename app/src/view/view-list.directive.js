//view/view-list.directive.js
;(function(){

	angular.module('app').directive('viewList', directiveFactory);

	directiveFactory.$inject = ['CONFIG'];
	function directiveFactory(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.TEMPLATE_URL + 'view-list.html'
		}
	}

})();
