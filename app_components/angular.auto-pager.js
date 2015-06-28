;(function(){

  angular.module('autoPager',[]).directive('autoPager', directiveFactory);

  function directiveFactory(){
    return {
      scope: {
        autoPagerMs: '@'
      },
      restrict: 'A',
      link: function(scope, el, attr, ctrl){
          ctrl.init(scope, el, attr);
      },
      controller: Controller
    }
  }

  function Controller(){
  }
  Controller.prototype = {
    init: init,
    getScrollTop: getScrollTop,
    getDocumentHeigh: getDocumentHeigh,
    bindEvent: bindEvent
  }

  function init(scope, el, attr){
    var o = this, c = o.config = {
      scope: scope,
      el: el,
      attr: attr
    };
    c.ms = c.scope.autoPagerMs || 300;
    o.bindEvent();
  }

  function bindEvent(){
    var o = this, c = o.config;
    var win = angular.element(window);
    if(Controller.scroll){
      win.off('scroll',Controller.scroll);  
    }
    Controller.scroll = function(evt){
      if(o.getDocumentHeigh() - window.innerHeight - c.ms < o.getScrollTop()){
        c.el.click();
      }
    }
    win.on('scroll',Controller.scroll); 
  }


  function getScrollTop(){
    return document.body.scrollTop || document.documentElement.scrollTop
  }
  function getDocumentHeigh(){
    return document.body.scrollHeight || document.documentElement.scrollHeight
  }
})();
