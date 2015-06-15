//app.config.js
;(function(){

	angular.module('app').config(config);

	config.$inject = [
		'$stateProvider',
		'$urlRouterProvider',
		'$locationProvider'
	];

	function config(
		$stateProvider,
		$urlRouterProvider,
		$locationProvider
	){
		var viewListPage = {
			template: '<article-list-view ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
			controllerAs: 'ctrl',
			controller: 'articleController'
		}

		var viewArticlePage = {
			template: '<article-view ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
			controllerAs: 'ctrl',
			controller: 'articleController'
		}

		$urlRouterProvider.otherwise('/');
		$stateProvider.
			state('home',{
				url: '/',
				views: {
					'viewArticle': viewListPage
				}
			}).
			state('category', {
				url: '/{pageId:library|jser}/category/{categoryId:.+}',
				views: {
					'viewArticle': viewListPage
				}
			}).
			state('page', {
				url: '/{pageId:library|jser}',
				views: {
					'viewArticle': viewListPage
				}
			}).
			state('article', {
				url: '/{pageId:library|jser}/{articleId:.+}',
				views: {
					'viewArticle': {
						template: articleTemplate,
						controllerAs: 'ctrl',
						controller: 'articleController'
					}

				}
			})
			;
			articleTemplate.$inject = ['$stateParams'];
			function articleTemplate($stateParams){
				return '<article-' + $stateParams.pageId + '-view ctrl="ctrl" data="ctrl.data"/>';
			}


/*
<library-article ng-if="s.pageId=='library'" ctrl="c" data="d"></library-article>
<jser-article ng-if="s.pageId=='jser'" ctrl="c" data="d"></jser-article>
*/




	}

})();
