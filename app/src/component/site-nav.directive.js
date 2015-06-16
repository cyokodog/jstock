//component/site-nav.directive.js
;(function(){

	angular.module('app').directive('siteNav', siteNavDirective);

	siteNavDirective.$inject = ['CONFIG'];
	function siteNavDirective(CONFIG) {
		return {
			scope: {},
			restrict: 'E',
			templateUrl: CONFIG.BASE_URL + 'component/site-nav.html',
			controllerAs: 'ctrl',
			controller: siteNavController
		}
	}

	siteNavController.$inject = ['CONFIG', '$stateParams'];
	function siteNavController(CONFIG, $stateParams){
		var ctrl = this;
		ctrl.pageInfo = CONFIG.PAGE_INFO;
		ctrl.state = $stateParams;
	}

})();
