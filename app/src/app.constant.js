// app.constant.js
// 各種設定値の定義
;(function(){

  angular.module('app').constant('CONFIG', {

    // システムのルートディレクトリ
    BASE_URL: '/',

    // ui.routerモジュールで読み込む view ファイルの保管場所
    VIEW_URL: 'view/',

    // テンプレートファイル置き場（directive から読み込まれる template file）
    TEMPLATE_URL: 'template/',

    // 一覧画面の autopager モード
    IS_AUTO_PAGER: true,

    // 本システムのメインデータの配布URL。JSONP形式。appfogで管理してるが、RESTFull形式にしてNode.js+Herokに移行したいとおもっている
    API_ENDPOINT: 'http://jquerydb.aws.af.cm/jstock/webapi/',

    // システム基本ページ。下記の各ページで一覧データを表示し、選択したら詳細画面を表示する構成
    PAGE_INFO: [
      {id: 'home', name: 'HOME'},
      {id: 'library', name: 'LIBRARY'},
      {id: 'jser', name: 'JSer'}
    ]
  });

})();
