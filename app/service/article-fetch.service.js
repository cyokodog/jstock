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
