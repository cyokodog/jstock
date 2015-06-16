//view/jser-card.directive.js
;(function(){

	angular.module('app').directive('jserCard', jserCardDirective);

	jserCardDirective.$inject = ['CONFIG'];
	function jserCardDirective(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.VIEW_URL + 'jser-card.html'
		}
	}

})();
