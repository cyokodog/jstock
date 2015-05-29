var Util = {
	extend: function(){
	    var ret = arguments[0]
	    for(var i = 1; i < arguments.length; i++){
	        var arg = arguments[i];
	        for(var j in arg) ret[j] = arg[j]
	    }
	    return ret;
	}
}
var Builder = function(){
    this.init.apply(this, Array.prototype.slice.call(arguments));
};
Builder.prototype = {
	plumberWithNotify: function() {
		var o = this, c = o.config;
		return c.p.plumber({errorHandler: c.p.notify.onError('<%= error.message %>')});
	},
	runServer: function(){
		var o = this, c = o.config;
		return c.browser({
			server: {
				baseDir: './'
			}
		});
	},

	compileHtml: function(gulpSrc) {
		var o = this, c = o.config;
		(gulpSrc || c.src)
			.pipe(o.plumberWithNotify())
		;
		return o;
	},
	compileSass: function(gulpSrc) {
		var o = this, c = o.config;
		(gulpSrc || c.src)
			.pipe(o.plumberWithNotify())
			.pipe(c.p.frontnote({
				css: '../css/style.css'
			}))
			.pipe(c.p.sass())
			.pipe(c.p.autoprefixer())
			.pipe(c.gulp.dest('./css'))
		;
		return o;
	},
	compileCss: function(gulpSrc) {
		var o = this, c = o.config;
		(gulpSrc || c.src)
			.pipe(c.p.concat('all.min.css'))
			.pipe(c.p.minifyCss())
			.pipe(c.gulp.dest('./css'))
		;
		return o;
	},
	compileJs: function(gulpSrc) {
		var o = this, c = o.config;
		(gulpSrc || c.src)
			.pipe(o.plumberWithNotify())
			.pipe(c.p.concat('all.min.js'))
			.pipe(c.p.uglify())
			.pipe(c.gulp.dest('./js'))
		;
		return o;
	},


	reload: function(gulpSrc) {
		var o = this, c = o.config;
		(gulpSrc || c.src)
			.pipe(c.browser.reload({
				stream:true
			}));
		;
		return o;
	},


	setSrc: function(src){
		var o = this, c = o.config;
		c.src = c.gulp.src(src);
		return o;
	},
    init: function(setting){
        var o = this, c = o.config = Util.extend({}, Builder.defaults, setting||{});
		c.gulp = require('gulp');
		c.p = require('gulp-load-plugins')();
		c.browser = require('browser-sync');
		for(var taskId in c.tasks){
			(function(taskId){
				var task = c.tasks[taskId];
				c.gulp.task(taskId, function() {
					!task.target || o.setSrc(task.target)
					task.callback(o);
				})
			})(taskId);
		}
		c.gulp.task('default', ['server'], function() {
			for(var taskId in c.tasks){
				(function(taskId){
					var task = c.tasks[taskId];
					if(task.target){
						c.gulp.watch(task.target,[taskId]);
					//	o.setSrc(task.target);
					//	task.callback(o);
					}
				})(taskId);
			}
		});
    }
}
Builder.defaults = {
	tasks: {
		server: {
			callback: function(api){
				api.runServer();
			}
		},
		js: {
			target: ['js/**/*.js','!js/all.min.js'],
			callback: function(api){
				api.compileJs().reload();
			}
		},
		html: {
			target: ['**/*.html'],
			callback: function(api){
				api.compileHtml().reload();
			}
		},
		sass: {
			target: ['sass/**/*.scss'],
			callback: function(api){
				api.compileSass();
			}
		},
		css: {
			target: ['css/*.css','!css/all.min.css'],
			callback: function(api){
				api.compileCss().reload();
			}
		}
	}
}

new Builder();





