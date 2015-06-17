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
