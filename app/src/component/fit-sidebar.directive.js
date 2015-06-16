//component/fit-sidebar.directive.js
;(function(){

	angular.module('app').directive('fitSidebar', fitSidebarDirective);

	function fitSidebarDirective(){
		return {
			scope: {},
			restrict: 'A',
			transclude: true,
			template: '<ng-transclude/>',
			link: function(scope, el, attr){
				jQuery(el).fitSidebar({
				    wrapper : '.l-contents',
					responsiveWidth : 960
				});
			}
		}
	}

})();
