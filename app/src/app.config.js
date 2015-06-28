// app.config.js
// urlの値に応じメインコンテンツ部の表示を下記いずれかのディレクティブを割り当てる
//
// 一覧画面：view-list
// 詳細画面：view-library, view-jser
//
// 制御処理は appController でまとめて行い、その際必要となるデータはディレクティブの属性値として渡している。
// 現状、システムの画面構成は上記の通り一覧画面と詳細画面のみだが、例えばトップ画面を独自のデザインにしたくなったら場合は
// 新規にトップ画面用のディレクティブを定義し、それを指定するようにすれば良い
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
