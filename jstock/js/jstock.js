/*
 * 	Go Top 0.2 - jQuery plugin
 *	written by cyokodog
 *
 *	Copyright (c) 2013 cyokodog 
 *		http://d.hatena.ne.jp/cyokodog/
 *		http://cyokodog.tumblr.com/
 *		http://www.cyokodog.net/
 *	MIT LICENCE
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function(){
	var plugin = $.goTop = function(option){
		var c = plugin.config = $.extend(plugin.defaults,option||{});
		c.win = $(window);
		if(c.button = c.win.data('go-top')) return c.button;
		c.button = $('<a href="#"/>').addClass(c.className).hide().
		on('click',function(){
			$(this).blur();
			$('html,body').animate({scrollTop:0},c.scrollSpeed);
			return false;
		});
		c.win.data('go-top', c.button);
		!c.label || $('<span/>').text(c.label).appendTo(c.button);
		var lazy = plugin.Lazy(plugin.toggleButton,c.delay);
		$(window).on('scroll',function(){
			lazy.run();
		});

		if(c.autoAppend){
			c.button.appendTo('body');
			plugin.toggleButton();
		}
		var w = c.button.width(),m = parseInt(c.button.css('margin-left'));
		c.button.css('margin-left',-w+m);
		return c.button;
	}
	plugin.toggleButton = function(){
		var c = plugin.config;
		if(c.bottom == undefined){
			c.bottom = parseInt(c.button.css('bottom'));
			c.height = c.button.outerHeight();
		}
		if(c.win.scrollTop() >= c.showTopPosition){
			!c.button.is(':hidden') ||
			c.button.show().css('bottom',-c.height).animate({bottom:-1},function(){
				c.button.animate({bottom:-c.height+30});
			});
		}
		else{
			c.button.is(':hidden') || 
			c.button.animate({bottom:-c.height},function(){
				c.button.hide();
			});
		}
	}
	plugin.Lazy = function(f,time){
		return {
			run : function(){
				var o = this;
				if(o.delay){
					clearTimeout(o.delay);
					o.delay = 0;
				}
				o.delay = setTimeout(f,time);
			}
		}
	}
	plugin.defaults = {
		label : '',
		autoAppend : true,
		delay : 300,
		scrollSpeed : 300,
		fadeSpeed : 500,
		className : 'go-top',
		showTopPosition : 400
	}
})(jQuery);

/*
 * 	fitSidebar 0.1 - jQuery plugin
 *	written by cyokodog
 *
 *	Copyright (c) 2014 cyokodog 
 *		http://www.cyokodog.net/
 *		http://d.hatena.ne.jp/cyokodog/)
 *		http://cyokodog.tumblr.com/
 *	MIT LICENCE
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
;(function($){
	var s = $.fitSidebar = function(target, option){
		var o = this, c = o.config = $.extend({}, s.defaults, option);
		c.target = $(target).addClass('fit-sidebar');
		c.blank = $('<div/>').addClass(s.id + '-blank').insertBefore(c.target);
		c.blank.css('border','solid 1px #fff');
		c.blank.css({
			'margin-top' : c.target.css('margin-top'),
			'margin-right' : c.target.css('margin-right'),
			'margin-bottom' : c.target.css('margin-bottom'),
			'margin-left' : c.target.css('margin-left'),
			'border-top-width' : c.target.css('border-top-width'),
			'border-right-width' : c.target.css('border-right-width'),
			'border-bottom-width' : c.target.css('border-bottom-width'),
			'border-left-width' : c.target.css('border-left-width'),
			'padding-top' : c.target.css('padding-top'),
			'padding-right' : c.target.css('padding-right'),
			'padding-bottom' : c.target.css('padding-bottom'),
			'padding-left' : c.target.css('padding-left')
		});
		c.wrapper = $(c.wrapper);
		c._win = $(window)
			.on('scroll', function(){
				o.adjustPosition();
			})
			.on('resize', function(){
				c.target.hasClass('for-chrome-bug');
				o.adjustPosition();
			});
			setTimeout(function(){
					o.adjustPosition();
			},0);
			setTimeout(function(){
					o.adjustPosition();
			},1000);
	}
	$.extend($.fitSidebar.prototype, {
		adjustPosition : function(){
			var o = this, c = o.config;
			if(c._win.width() < c.responsiveWidth){
				c.wrapper.removeClass(c.fixedClassName);
				c.wrapper.addClass(c.noFixedClassName);
				c.target.removeClass(s.id + '-fixed');
				c.blank.hide();
				c.target.width('auto');
				c.direction = null;
				return;
			}
			c.wrapper.addClass(c.fixedClassName);
			c.wrapper.removeClass(c.noFixedClassName);
			c.target.addClass(s.id + '-fixed');
			var offset = c.blank.show().offset();
			var scrollTop = c._win.scrollTop()
			var outerHeight = c.target.outerHeight();
			var overHeight = outerHeight - c._win.height();
			if(overHeight < 0) overHeight = 0;
			if(!c.direction){
				c.lastFixedTop = c.lastDownFixedTop = c.lastUpFixedTop = offset.top - scrollTop;
				c.lastScrollTop = c.lastDownScrollTop = c.lastUpScrollTop = scrollTop;
			}
			c.target.width(c.blank.width());
			c.blank.height(c.target.height());
			c.direction = scrollTop < c.lastScrollTop ? 'up' : 'down';
			var adjustDown = function(){
				var top = c.lastUpFixedTop + (c.lastUpScrollTop - scrollTop)
				if(top < 0){
					if(top + overHeight < 0){
						top = -overHeight;
						var limit = c.wrapper.offset().top + c.wrapper.height();
						var pos = scrollTop + outerHeight + top;
						if(pos > limit){
							top = (limit - scrollTop) - outerHeight;
						}
					}
				}
				c.target.css({
					top : top,
					bottom : 'auto'
				});
				c.lastDownFixedTop = top;
				c.lastDownScrollTop = scrollTop;
			}
			var adjustUp = function(){
				var top = c.lastDownFixedTop + (c.lastDownScrollTop - scrollTop)
				if(top > 0){
					top = offset.top-scrollTop;
					if(top < 0) top = 0;
				}
				c.target.css({
					top : top,
					bottom : 'auto'
				});
				c.lastUpFixedTop = top;
				c.lastUpScrollTop = scrollTop;
			}
			if(c.direction == 'down'){
				adjustDown();
//				adjustUp();
			}
			else{
				adjustUp();
//				adjustDown();
			}
			c.lastFixedTop = top;
			c.lastScrollTop = scrollTop;



		}
	});
	$.fn.fitSidebar = function(option){
		return this.each(function(){
			var el = $(this);
			el.data(s.id, new $.fitSidebar(el, option));
		});
	}
	$.extend(s, {
		defaults : {
			wrapper : 'body',
			responsiveWidth : 0,
			fixedClassName : 'fit-sidebar-fixed-now',
			noFixedClassName : 'fit-sidebar-no-fixed-now'
		},
		id : 'fit-sidebar'
	});
})(jQuery);


;(function($){

	$.getPageScroller = function(){
		var o = $.getPageScroller;
		if(o.scroller){
			return o.scroller;
		}
		var scroller = $('body');
		var div = $('<div style="height:3000px"/>').appendTo('body');
		var top = 0;
		$('html,body').each(function(){
			top = $(this).scrollTop() || top;
		}).scrollTop(0);
		scroller.scrollTop(3000);
		if(!scroller.scrollTop()){
			scroller = $('html');
		}
		div.remove();
		return o.scroller = scroller.scrollTop(top);
	}

	$.fixedActivity = function(show){
		var o = $.fixedActivity;
		var body = $('body'),win = $(window);
		if(!o.pageWrapper){
			o.pageWrapper = body.wrapInner('<div/>').find('> div').eq(0);
		}
		body.activity(show);
		if(show){
			var icon = body.find('> *').eq(0);
			icon.css({
				margin :0,
				position:'fixed',
				top:(win.height() - icon.height()) / 2,
				left:(win.width() - icon.width()) / 2
			});
		}
		o.pageWrapper.css({opacity: show ? .3 : 1});
	}


	$.titleLoading = function(show){
		var title = $('title');
		var orgText = title.data('title-loading-org-text');
		if(!orgText){
			orgText = title.html();
			title.data('title-loading-org-text',orgText);
		}
		if(show){
			var text = '.';
			var showLoading = function(){
				$('title').html(text);
				$.titleLoading.timer = setTimeout(function(){
					if(text.length > 5){
						text = '';
					}
					text = '.' + text;
					showLoading();
				},300);
			}
			showLoading();
		}
		else{
			clearTimeout($.titleLoading.timer);
			title.html(orgText);
		}
	}

	$.jstock = function( option ){
		if(!(this instanceof $.jstock)){
			return new $.jstock();
		}
		this.init( option );
	}

	$.extend($.jstock.prototype,{
		init : function( option ){
			var o = this,
			c = o.config = $.extend({
				articleAjax : '',
				debugInfo : ''
			} , $.jstock.defaults , option);

			$('div.l-page-nav__body').fitSidebar({
				wrapper : '.l-contents',
				responsiveWidth : 960
			});
			//Go Top
			$.goTop({label:''});

			$('.site-header__text a').prop('href', c.homeUrl);

			c.debugInfo = $('<div style="position:fixed;bottom:0;right:0;color:#aaa"/>').appendTo('body')

			o.loadTemplate();

			o.rendar();
			$(window).hashchange(function(){
				o.rendar();
			});

			if(localStorage && !localStorage.getItem(c.localStorageClearId)){
				localStorage.clear();
				localStorage.setItem(c.localStorageClearId,'1');
			}
		},
		loadTemplate : function(){
			$('script.tmpl').each(function(){
				var target = $(this);
				target.template(target.prop('id'));
			});
		},

		rendar : function(){
			var o = this, c = o.config;
			function getCategory(){
				var defer = $.Deferred();
				$.ajax({
					url : c.apiUrl,
					data : {
						contentsType : 'category'
					},
					dataType : 'jsonp',
					success : defer.resolve,
					error :  defer.reject
				});
				return defer.promise()
			}
			function getArticle(param){
				var defer = $.Deferred();
				$.ajax({
					url : c.apiUrl,
					data : $.extend({
						contentsType : 'article'
					},param),
					dataType : 'jsonp',
					success : defer.resolve,
					error :  defer.reject
				});
				return defer.promise()
			}
			var setPager = function(param){
				var url = '#/';
				if(param.page != 'home'){
					url += (param.page + '/') + (param.category_id != '*' ? param.category_id + '/' : '');
				}
				$('.pager a.prev-page,.pager a.next-page').each(function(){
					var target = $(this);
					target.prop('href',url + ((target.data('page')-0) > 1 ? 'page/' + target.data('page') + '/' : '')) ;
				});
			};

			var param = o.queryStringToJson();
			$('div.site-nav li').removeClass('is-active');
			if(param.page == 'library'){
				$('li.site-nav__library').addClass('is-active');
			}
			else
			if(param.page == 'jser') {
				$('li.site-nav__jser').addClass('is-active');
			}
			else{
				$('li.site-nav__home').addClass('is-active');
			}

			$.getPageScroller().animate({scrollTop : 0});

			var $nav = $('div.l-page-nav__body');
			var navKey = 'category-list';
			var $art = $('.article').empty();
			var artKey;

			$.titleLoading(true);
			$.fixedActivity(true);
			c.debugInfo.html('');

			if(localStorage){
				$nav.html(localStorage.getItem(navKey) || '');
			}
			getCategory().done(function(data){
				$nav.empty().append($.tmpl('tmpl-cateogry-section', data));
				!localStorage || localStorage.setItem(navKey, $nav.html());
				var param = o.queryStringToJson();

				var cache;
				if(localStorage){
					localStorage.setItem(navKey, $nav.html());
					artKey = encodeURIComponent($.param(param));
					cache = localStorage.getItem(artKey);
				}
				$art.css('opacity', 0);
				if(cache){
					$art.html(cache || '');
					$.fixedActivity(false);
					$art.animate({'opacity' : 1}, c.fadeTime)
					c.debugInfo.html('cache');
				}
				getArticle(param).done(function(data){
					var id = param.single_id == '*' ? 'cateogry' : param.page == 'library' ? param.page : 'jser';
					$art.empty().prepend($.tmpl('tmpl-' + id + '-article',data));
					if(localStorage){
						localStorage.setItem(artKey, $art.html());
					}
					$.titleLoading(false);
					$.fixedActivity(false);
					$art.animate({'opacity' : 1}, c.fadeTime)
					setPager(param);
					c.debugInfo.html('loaded');
				});
			});
		},


		queryStringToJson : function(){
			var $path = location.hash.replace(/\/$/,'').split('/');
			$path.splice(0,1);

			var json = {
				page : '*',
				page_no : 1,
				category_id : '*',
				single_id : '*'
			};
			var errflg = 0;

			var setPage = function(){
				var idx = $path.length - 2;
				if($path[idx] == 'page'){
					if(isNaN($path[idx+1])){
						//alert('err22');
						errflg = 1;
					}
					json.page_no = $path[idx+1];
					return true;
				}
				return false;
			}

			var isCategoryId = function(sectionId,categoryId){
				return !!$('ul.' + sectionId + '-category-list a[data-category-id=' + categoryId + ']').size();
			}

			var setContentsId = function(){
				var id =$path[1];
				if(id != 'page'){
					if(isCategoryId(json.page,id)){
						json.category_id = id;
					}
					else{
						json.single_id = id;
					}
				}
			}
			if($path.length == 0){
				json.page = 'home';
			}
			else{
				if($path[0] != 'library' && $path[0] != 'jser' && $path[0] != 'page'){
					errflg = 1;
				}
				json.page = $path[0] == 'page' ? 'home' : $path[0];
				if($path.length == 1){
					if($path[0] == 'page') errflg = 2;
				}
				else
				if($path.length == 2){
					if($path[1] == 'page'){
						errflg = 3;
					}
					if(!setPage()){
						setContentsId();
					}
				}
				else
				if($path.length == 3){
					if($path[1] != 'page'){
						errflg = 4;
					}
					if(setPage()){
						setContentsId();
					}
				}
				else
				if($path.length == 4){
					if($path[2] != 'page'){
						errflg = 5;
					}
					if(setPage()){
						setContentsId();
					}
				}
				else{
					errflg = 6;
				}
			}
			if(errflg){
				json.errmsg = '404 not found (' + errflg + ')';
			}
			return json;
		}
	});

	$.jstock.defaults = {
	//	homeUrl : 'http://www.cyokodog.net/jstock/',
		homeUrl : 'http://cyokodog.github.io/jstock/',
		apiUrl : 'http://jquerydb.aws.af.cm/jstock/webapi',
		fadeTime : 1000,
		localStorageClearId : 'localStorageClear001'
	}


})(jQuery);
