//app.module.js
;(function(){

	angular.module('app', ['ui.router', 'ngAnimate', 'angular-loading-bar', 'autoPager']);

})();

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
    var articleListView = {
      template: '<view-list ctrl="ctrl" data="ctrl.data" state="ctrl.state"/>',
      controllerAs: 'ctrl',
      controller: 'appController'
    }
    $urlRouterProvider.otherwise('/');
 
    $stateProvider.
      state('home',{
        url: '/',
        views: {
          'viewArticle': articleListView
        }
      }).
      state('category', {
        url: '/{pageId:library|jser}/category/{categoryId:.+}',
        views: {
          'viewArticle': articleListView
        }
      }).
      state('page', {
        url: '/{pageId:library|jser}',
        views: {
          'viewArticle': articleListView
        }
      }).
      state('article', {
        url: '/{pageId:library|jser}/{articleId:.+}',
        views: {
          'viewArticle': {
            template: articleTemplate,
            controllerAs: 'ctrl',
            controller: 'appController'
          }

        }
      })
      ;
 
      articleTemplate.$inject = ['$stateParams'];
      function articleTemplate($stateParams){
        return '<view-' + $stateParams.pageId + ' ctrl="ctrl" data="ctrl.data"/>';
      }
  }

})();

//app.constant.js
;(function(){

  angular.module('app').constant('CONFIG', {
    BASE_URL: '/',
    VIEW_URL: 'view/',
    TEMPLATE_URL: 'template/',
    IS_AUTO_PAGER: true,
    API_ENDPOINT: 'http://jquerydb.aws.af.cm/jstock/webapi/',
    PAGE_INFO: [
      {id: 'home', name: 'HOME'},
      {id: 'library', name: 'LIBRARY'},
      {id: 'jser', name: 'JSer'}
    ]
  });

})();

//app.controller.js
;(function(){

	angular.module('app').controller('appController', Controller);

	Controller.$inject = [
		'CONFIG',
		'$stateParams',
		'articleFetchService',
		'jserCategoryService'
	];

	angular.extend(Controller.prototype, {
		fetchData: fetchData,
		nextPage: nextPage,
		prevPage: prevPage
	});

	function Controller(
		CONFIG,
		$stateParams,
		articleFetchService,
		jserCategoryService
	){
		var o = this, c = o.config = {};
		var arg = arguments;
		Controller.$inject.forEach(function(name, i){
			c[name] = arg[i];
		});
		c.isAutoPager = c.CONFIG.IS_AUTO_PAGER;
		c.pageNo = 1;
		o.state = c.$stateParams;
		o.fetchData(c.pageNo, true);
	}

	function fetchData(pageNo, isToTop){
		var o = this, c = o.config;
		c.articleFetchService.exec({
			page: o.state.pageId || 'home',
			page_no: c.pageNo,
			category_id: o.state.categoryId || '*', 
			single_id: o.state.articleId || '*'
		}).then(function(res){

			//autopagerモードの場合はconcatで配列にデータを追加し、通常モードの場合は上書きする
			if(!c.isAutoPager || !o.data){
				o.data = res;
			}
			else{
				var list = o.data.article_list.concat(res.article_list)
				o.data = res;
				o.data.article_list = list;
			}
			o.data.info = res.article_list_info[0];

			//次頁有無の判定結果をセット
			o.data.isNextPage = (o.data.info.next_page_no > c.pageNo);

			//autopagerモードの場合は前頁リンクを非表示にする
			if(c.isAutoPager){
				o.data.isPrevPage = false;
			}
			else{
				o.data.isPrevPage = (1 < c.pageNo);
			}

			//jserの詳細画面で表示するjser category は API より取得不可
			//よって独自ロジック(jserCategoryService)にてカテゴリの設定を行う
			if(o.state.articleId){
				o.data.jserCategory = c.jserCategoryService.get(o.data.plugins_qty, o.data.jp_flg);
			}

			//autopagerモードでない場合は次頁に遷移した場合スクロール位置を先頭に戻す
			if(isToTop || !c.isAutoPager){
				setTimeout(function(){
					document.body.scrollTop = 0;
				},0)
			}
		});
	}

	function nextPage() {
		var o = this, c = o.config;
		if(!o.state.articleId && o.data.isNextPage){
			c.pageNo ++;
			o.fetchData(c.pageNo);
			o.data.isNextPage = false;
		}
	}

	function prevPage() {
		var o = this, c = o.config;
		c.pageNo --;
		o.fetchData(c.pageNo);
	}

})();




//component/category-list.directive.js
;(function(){

	angular.module('app').directive('categoryList', categoryListDirective);

	categoryListDirective.$inject = ['CONFIG'];
	function categoryListDirective(CONFIG){
		return {
			scope: {},
			require: 'categoryList',
			restrict: 'E',
			templateUrl: CONFIG.BASE_URL + 'component/category-list.html',
			link: function (scope, el, attr, selfController) {
				selfController.init();
			},
			controllerAs : 'ctrl',
			controller: categoryListController
		}
	}

	categoryListController.$inject = ['$scope','categoryFetchService'];
	function categoryListController($scope, categoryFetchService){
		var o = this;
		o.data = {};
		o.init = function () {
			categoryFetchService.exec().then(function(res){
				o.data.category = res;
			});
		}
	}

})();

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

//services/article-fetch.service.js
;(function(){

	angular.module('app').factory('articleFetchService', articleFetchService);

	articleFetchService.$inject = ['$http', '$q', 'CONFIG'];
	function articleFetchService($http, $q, CONFIG){
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
	}

})();

//services/category-fetch.service.js
;(function(){

	angular.module('app').factory('categoryFetchService', categoryFetchService);

	categoryFetchService.$inject = ['$http', '$q', 'CONFIG'];
	function categoryFetchService($http, $q, CONFIG){
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
	}

})();

;(function(){

	angular.module('app').factory('jserCategoryService', jserCategoryService);

	function jserCategoryService(){
		return {
			get: function(plugins_qty, jp_flg){
				var ret = {}
        if(plugins_qty > 0){
          if(jp_flg == '1') {
            ret = {type: 'japanese-creator', name: 'Japanese Creator'}
          }
          else{
            ret = {type: 'creator', name: 'Creator'}
          }
        }
        else{
          if(jp_flg == '1') {
            ret = {type: 'japanese-reviewer', name: 'Japanese Reviewer'}
          }
        }
				return ret;
			}
		}
	}

})();

//view/card-jser.directive.js
;(function(){

	angular.module('app').directive('cardJser', directiveFactory);

	directiveFactory.$inject = ['CONFIG'];
	function directiveFactory(CONFIG) {
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.TEMPLATE_URL + 'card-jser.html'
		}
	}

})();

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

//view-jser.directive.js
;(function(){

	angular.module('app').directive('viewJser', directiveFactory);

	directiveFactory.$inject = ['CONFIG'];
	function directiveFactory(CONFIG){
		return {
			scope: {
				c: '=ctrl',
				d: '=data',
				s: '=state'
			},
			restrict: 'E',
			templateUrl: CONFIG.TEMPLATE_URL + 'view-jser.html'
		}
	}

})();

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
