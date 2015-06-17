
//app.controller.js
;(function(){

	angular.module('app').controller('appController', appController);

	appController.$inject = [
		'CONFIG',
		'$stateParams',
		'articleFetchService',
		'jserCategoryService'
	];

	function appController(
		CONFIG,
		$stateParams,
		articleFetchService,
		jserCategoryService
	){
		this.config = {
			isAutoPager: CONFIG.IS_AUTO_PAGER,
			articleFetchService: articleFetchService,
			jserCategoryService: jserCategoryService,
			$stateParams: $stateParams
		};

		this.init();
	}
	angular.extend(appController.prototype, {

		init: function(){
			var o = this, c = o.config;
			c.pageNo = 1;
			o.state = c.$stateParams;
			o.fetchData(c.pageNo, true);
			if(c.isAutoPager){
				o.autoPager();
			}
		},

		fetchData: function(pageNo, isToTop){
			var o = this, c = o.config;
			c.articleFetchService.exec({
				page: o.state.pageId || 'home',
				page_no: c.pageNo,
				category_id: o.state.categoryId || '*', 
				single_id: o.state.articleId || '*'
			}).then(function(res){
				if(!c.isAutoPager || !o.data){
					o.data = res;
				}
				else{
					var list = o.data.article_list.concat(res.article_list)
					o.data = res;
					o.data.article_list = list;
				}
				o.data.info = res.article_list_info[0];
				o.data.isNextPage = (o.data.info.next_page_no > c.pageNo);
				if(c.isAutoPager){
					o.data.isPrevPage = false;
				}
				else{
					o.data.isPrevPage = (1 < c.pageNo);
				}
				if(o.state.articleId){
					o.data.jserCategory = c.jserCategoryService.get(o.data.plugins_qty, o.data.jp_flg);
				}
				if(isToTop || !c.isAutoPager){
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
				o.fetchData(c.pageNo);
				o.data.isNextPage = false;
			}
		},

		prevPage: function () {
			var o = this, c = o.config;
			c.pageNo --;
			o.fetchData(c.pageNo);
		},

		autoPager: function(){
			var o = this, c = o.config;
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
		}
	});

})();
