//main/article.controller.js
;(function(){

	angular.module('app').controller('articleController', articleController);

	articleController.$inject = [
		'$stateParams',
		'articleFetchService'
	];

	function articleController(
		$stateParams,
		articleFetchService
	){
		this.init.apply(this, Array.prototype.slice.call(arguments));
	}
	angular.extend(articleController.prototype, {

		init: function($stateParams, articleFetchService){

			var o = this, c = o.config = {
				articleFetchService: articleFetchService,
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
			c.articleFetchService.exec({
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
		if(getDocumentHeigh() - 1000 < getScrollTop()){
			var el = document.querySelector('.next-page');
			if(el) el.click()
		}
	})

})();
