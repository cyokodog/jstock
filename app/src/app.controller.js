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



