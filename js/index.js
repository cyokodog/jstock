var app = angular.module('app', ['ui.router', 'ngAnimate', 'angular-loading-bar']);

app.constant('CONFIG', {
	API_ENDPOINT: 'http://jquerydb.aws.af.cm/jstock/webapi/',
	PAGE_INFO: [
		{id: 'home', name: 'HOME'},
		{id: 'library', name: 'LIBRARY'},
		{id: 'jser', name: 'JSer'}
	]
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
	function (
		$stateProvider,
		$urlRouterProvider,
		$locationProvider
	){
		var viewListPage = {
			template: '<list-page ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
			controllerAs: 'ctrl',
			controller: articleController
		}

		var viewArticlePage = {
			template: '<article-page ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
			controllerAs: 'ctrl',
			controller: articleController
		}

		$urlRouterProvider.otherwise('/');
		$stateProvider
		.
		state('home',{
			url: '/',
			views: {
				'viewArticle': viewListPage
			}
		})
		.
		state('category', {
			url: '/{pageId:library|jser}/category/{categoryId:.+}',
			views: {
				'viewArticle': viewListPage
			}
		})
		.
		state('page', {
			url: '/{pageId:library|jser}',
			views: {
				'viewArticle': viewListPage
			}
		})
		.
		state('article', {
			url: '/{pageId:library|jser}/{articleId:.+}',
			views: {
				'viewArticle': viewArticlePage
			}
		})


		articleController.$inject = [
			'$stateParams',
			'fetchArticleService'
		];
		function articleController(
			$stateParams,
			fetchArticleService
		){
			this.init.apply(this, Array.prototype.slice.call(arguments));
		}
		angular.extend(articleController.prototype, {

			init: function($stateParams, fetchArticleService){
				var o = this, c = o.config = {
					fetchArticleService: fetchArticleService,
					pageNo: 1
				}
				o.state = $stateParams;
				o.fetchData(c.pageNo);
			},

			initJserCategory: function(){
				var o = this, c = o.config;
				if(o.state.pageId == 'jser'){
					if(o.data.plugins_qty > 0){
						if(o.data.jp_flg == '1') {
							o.data.jserCategory = {type: 'japanese-creator', name: 'Japanese Creator'}
						}
						else{
							o.data.jserCategory = {type: 'creator', name: 'Creator'}
						}
					}
					else{
						if(o.data.jp_flg == '1') {
							o.data.jserCategory = {type: 'japanese-reviewer', name: 'Japanese Reviewer'}
						}
					}
				}
			},

			fetchData: function(pageNo, isAutoPager){
				var o = this, c = o.config;
				c.fetchArticleService.exec({
					page: o.state.pageId || 'home',
					page_no: c.pageNo,
					category_id: o.state.categoryId || '*', 
					single_id: o.state.articleId || '*'
				}).then(function(res){
					if(!isAutoPager || !o.data){
						o.data = res;
					}
					else{
						var list = o.data.article_list.concat(res.article_list)
						o.data = res;
						o.data.article_list = list;
					}
					o.data.info = res.article_list_info[0];
					o.data.isNextPage = (o.data.info.next_page_no > c.pageNo);
				//	o.data.isPrevPage = (1 < c.pageNo);
					o.data.isPrevPage = false;
					if(o.state.articleId) o.initJserCategory();
					if(!isAutoPager){
						setTimeout(function(){
							document.body.scrollTop = 0;
						},0)
					}
				});
			},

			nextPage: function () {
				var o = this, c = o.config;
				if(!o.state.articleId && o.data.isNextPage){
					c.pageNo ++;
					o.fetchData(c.pageNo, true);
					o.data.isNextPage = false;
				}
			},

			prevPage: function () {
				var o = this, c = o.config;
				c.pageNo --;
				o.fetchData(c.pageNo);
			}
		});


		var getScrollTop = function(){
			return document.body.scrollTop || document.documentElement.scrollTop
		}
		var getDocumentHeigh = function(){
			return document.body.scrollHeight || document.documentElement.scrollHeight
		}
		var win = angular.element(window);
		win.on('scroll', function(evt){
			console.log(getScrollTop(), getDocumentHeigh())
			if(getDocumentHeigh() - 1000 < getScrollTop()){
				var el = document.querySelector('.next-page');
				if(el) el.click()
			}
		})

	}
]);

app.directive('siteNav', function () {
	return {
		scope: {},
		restrict: 'E',
		//templateUrl: 'directive/list_page.html'
		templateUrl: 'directive/site_nav.html',
		controllerAs: 'ctrl',
		controller: ['CONFIG', '$stateParams', function(CONFIG, $stateParams){
			var ctrl = this;
			ctrl.pageInfo = CONFIG.PAGE_INFO;
			ctrl.state = $stateParams;
		}]
	}
});

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

app.directive('fitSidebar', function(){
	return {
		scope: {},
		restrict: 'A',
		transclude: true,
		template: '<ng-transclude/>',
		link: function(scope, el, attr){
			$(el).fitSidebar({
			    wrapper : '.l-contents',
				responsiveWidth : 960
			});
		}
	}
});


