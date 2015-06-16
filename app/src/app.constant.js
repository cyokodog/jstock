//app.constant.js
;(function(){

    angular.module('app').constant('CONFIG', {
        BASE_URL: '/',
        VIEW_URL: 'view/',
        API_ENDPOINT: 'http://jquerydb.aws.af.cm/jstock/webapi/',
        PAGE_INFO: [
            {id: 'home', name: 'HOME'},
            {id: 'library', name: 'LIBRARY'},
            {id: 'jser', name: 'JSer'}
        ]
    });

})();
