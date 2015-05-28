var app = angular.module('app', ['ui.router']);

app.constant('CONFIG', {
	API_ENDPOINT: 'http://jquerydb.aws.af.cm/jstock/webapi/'
});

app.factory('fetchCategoryService', ['$http', '$q', 'CONFIG', function($http, $q, CONFIG){
	return {
		exec: function (params) {
			var d = $q.defer();
			$http.jsonp(CONFIG.API_ENDPOINT, {
				params: angular.extend({
					callback: 'JSON_CALLBACK',
					contentsType : 'category'
				}, params)
			}).
			success(function(res){
				d.resolve(res);
			});
			return d.promise;
		}
	}
}]);

app.factory('fetchArticleService', ['$http', '$q', 'CONFIG', function($http, $q, CONFIG){
	return {
		exec: function (params) {
			['page', 'page_no', 'category_id', 'single_id'].forEach(function (k) {
				params[k] = params[k] || '*';
			});
			var d = $q.defer();
			$http.jsonp(CONFIG.API_ENDPOINT, {
				params: angular.extend({
					callback: 'JSON_CALLBACK',
					contentsType : 'article'
				}, params)
			}).
			success(function(res){
				d.resolve(res);
			});
			return d.promise;
		}
	}
}]);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function ($stateProvider, $urlRouterProvider, $locationProvider){

		$urlRouterProvider.otherwise('/');
		$stateProvider
			.
			state('home',{
				url: '/',
				views: {
					'viewArticle': {
						template: '<list-page ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
//						template: '<hoge ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
						controllerAs: 'ctrl',
						controller: 'mainController'
					},
				}
			})
			.
			state('category', {
				url: '/{pageId:library|jser}/category/{categoryId:.+}',
				views: {
					'viewArticle': {
						template: '<list-page ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
						controllerAs: 'ctrl',
						controller: 'mainController'
					},
				}
			})
			.
			state('page', {
				url: '/{pageId:library|jser}',
				views: {
					'viewArticle': {
//						templateUrl: 'views/list.html',
						template: '<list-page ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
						controllerAs: 'ctrl',
						controller: 'mainController'
					}
				}
			})
			.
			state('article', {
				url: '/{pageId:library|jser}/{articleId:.+}',
				views: {
					'viewArticle': {
//						templateUrl: 'views/article.html',
						template: '<article-page ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
						controllerAs: 'ctrl',
						controller: 'mainController'
					}
				}
			})
	}
]);

app.controller('mainController', ['$stateParams', 'fetchArticleService', function($stateParams, fetchArticleService){
	var ctrl = this;
//	ctrl.params = $stateParams;
	ctrl.state = $stateParams;
	var fetchData = function(pageNo){
		fetchArticleService.exec({
			page: $stateParams.pageId || 'home',
			page_no: pageNo,
			category_id: $stateParams.categoryId || '*', 
			single_id: $stateParams.articleId || '*'
		}).then(function(res){
			ctrl.data = res;
			if($stateParams.pageId == 'jser'){
				if(ctrl.data.plugins_qty > 0){
					if(ctrl.data.jp_flg == '1') {
						ctrl.data.jserCategory = {type: 'japanese-creator', name: 'Japanese Creator'}
					}
					else{
						ctrl.data.jserCategory = {type: 'creator', name: 'Creator'}
					}
				}
				else{
					if(ctrl.data.jp_flg == '1') {
						ctrl.data.jserCategory = {type: 'japanese-reviewer', name: 'Japanese Reviewer'}
					}
				}
			}
			ctrl.data.info = res.article_list_info[0];
			ctrl.data.isNextPage = (ctrl.data.info.next_page_no > pageNo);
			ctrl.data.isPrevPage = (1 < pageNo);
		});
	}
	var pageNo = 1;
	fetchData(pageNo);
	ctrl.nextPage = function () {
		pageNo ++;
		fetchData(pageNo);
		document.body.scrollTop = 0;

	}
	ctrl.prevPage = function () {
		pageNo --;
		fetchData(pageNo);
		document.body.scrollTop = 0;
	}

	document.body.scrollTop = 0;

}]);

app.directive('listPage', function () {
	return {
		scope: {
			c: '=ctrl',
			d: '=data',
			s: '=state'
		},
		restrict: 'E',
		templateUrl: 'directive/list_page.html'
	}
});

app.directive('articlePage', function () {
	return {
		scope: {
			c: '=ctrl',
			d: '=data',
			s: '=state'
		},
		restrict: 'E',
		templateUrl: 'directive/article_page.html'
	}
});

app.directive('libraryCard', function () {
	return {
		scope: {
			c: '=ctrl',
			d: '=data',
			s: '=state'
		},
		restrict: 'E',
		templateUrl: 'directive/library_card.html'
	}
});

app.directive('jserCard', function () {
	return {
		scope: {
			c: '=ctrl',
			d: '=data',
			s: '=state'
		},
		restrict: 'E',
		templateUrl: 'directive/jser_card.html'
	}
});

app.directive('libraryArticle', function () {
	return {
		scope: {
			c: '=ctrl',
			d: '=data',
			s: '=state'
		},
		restrict: 'E',
		templateUrl: 'directive/library_article.html'
	}
});

app.directive('jserArticle', function () {
	return {
		scope: {
			c: '=ctrl',
			d: '=data',
			s: '=state'
		},
		restrict: 'E',
		templateUrl: 'directive/jser_article.html'
	}
});


//app.directive('categoryList', ['fetchCategoryService', function(fetchCategoryService){
app.directive('categoryList', function(){
	return {
		scope: {
		},
		require: 'categoryList',
		restrict: 'E',
		templateUrl: 'directive/category_list.html',

		//linkの初期化実行後にcontroller.initをコール（controllerはlink前に実行される）
		link: function (scope, el, attr, selfController) {
			selfController.init();
		},
		controllerAs : 'ctrl',
		controller: ['$scope','fetchCategoryService', function($scope, fetchCategoryService){
			var o = this;
			o.data = {};
			o.init = function () {
				fetchCategoryService.exec().then(function(res){
				//	$scope.categoryData = res;
					o.data.category = res;
				});
			}
		}]
	}
});
