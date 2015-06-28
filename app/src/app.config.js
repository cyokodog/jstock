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
