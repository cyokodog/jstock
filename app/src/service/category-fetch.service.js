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
