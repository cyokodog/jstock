(function(){

	var gulp = require('gulp');
	var p = require('gulp-load-plugins')();
	var browser = require('browser-sync');
	var runSequence = require('run-sequence');
	var merge = require('event-stream').merge;

	function plumberWithNotify(){
		return p.plumber({
			errorHandler: p.notify.onError('<%= error.message %>')
		});
	}

/*
	gulp.task('compileSass', function(done) {
		return gulp.src([
			'client/sass/style.scss'
		]).
			pipe(p.using()).
			pipe(plumberWithNotify()).
			pipe(p.sass()).
			pipe(p.autoprefixer()).
//			pipe(p.concat('app-all.css')).
			pipe(gulp.dest('client/dist/'))
		;	
	});
*/

	gulp.task('concatCssLib', function(done) {
		return gulp.src([
			'resource/jquery.fit-sidebar.css',
			'bower_components/angular-loading-bar/build/loading-bar.css'
		]).
			pipe(plumberWithNotify()).
			pipe(p.using()).
			pipe(p.concat('lib-all.css')).
			pipe(gulp.dest('app/dist/'))
		;	
	});


	gulp.task('concatJsLib', function(done) {
		return gulp.src([
			'bower_components/jquery/jquery.js',
			'app_components/jquery.fit-sidebar.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-ui-router/release/angular-ui-router.js',
			'bower_components/angular-animate/angular-animate.js',
			'bower_components/angular-loading-bar/build/loading-bar.js',
		]).
			pipe(plumberWithNotify()).
			pipe(p.using()).
			pipe(p.concat('lib-all.js')).
			pipe(gulp.dest('app/dist/'))
		;	
	});


	gulp.task('concatJs', function(done) {
		gulp.src(['app/**/*.js', '!app/**/app.module.js', '!app/dist/*.js']).
			pipe(plumberWithNotify()).
			pipe(p.using()).
			pipe(p.concat('app-all.js')).
			pipe(gulp.dest('app/dist/')).
			on('end', function(){
				gulp.src(['app/**/app.module.js', 'app/dist/app-all.js']).
					pipe(p.concat('app-all.js')).
					pipe(gulp.dest('app/dist/')).
					on('end', function(){
						gulp.src(['app/dist/lib-all.js', 'app/dist/app-all.js']).
							pipe(p.concat('all.js')).
							pipe(gulp.dest('app/dist/')).
							on('end', done);
					});

			})
		;
	});

	gulp.task('jsMinify', ['concatJs'], function(done) {
		return gulp.src(['app/dist/all.js']).
			pipe(p.concat('all.min.js')).
			pipe(p.uglify()).
			pipe(gulp.dest('app/dist/'))
		;
	});


	gulp.task('server', function(){
		return browser({
			port: '3010',
			server: {
				baseDir: './app/'
			}
		});
	})

	gulp.task('watch', function(done){
		gulp.watch(['app/**/*.js'], ['concatJs', browser.reload]);
		gulp.watch(['app/**/*.html'], [browser.reload]);
		done();
	});


	gulp.task('default', ['server'], function(){

		runSequence(
			'concatCssLib',
			'concatJsLib',
			'concatJs',
			'watch',
			browser.reload
		);

	});

})();

