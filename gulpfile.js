(function(){

    var gulp = require('gulp');
    var p = require('gulp-load-plugins')();
    var browser = require('browser-sync');
    var runSequence = require('run-sequence');
    var merge = require('event-stream').merge;

    var del = require('del');


    function plumberWithNotify(){
        return p.plumber({
            errorHandler: p.notify.onError('<%= error.message %>')
        });
    }

    gulp.task('clean', function(done) {
        del(['app/dist/**/*'], done);
    });

    gulp.task('copyResource', function(done) {
        return gulp.src(
            [
                'app/src/**/*.*',
                '!app/src/**/*.html',
                '!app/src/**/*.js',
                '!app/src/**/*.css',
                '!app/src/**/*.scss'
            ],
            {
                base: 'app/src'
            }
        ).
        pipe(gulp.dest('app/dist'))
        ;   
    });

    gulp.task('copyHtml', function(done) {
        return gulp.src(
                [
                    'app/src/**/*.html'
                ],
                {
                    base: 'app/src'
                }
            ).
            pipe(gulp.dest('app/dist'))
        ;   
    });


    gulp.task('concatCssLib', function(done) {
        return gulp.src([
            'resource/jquery.fit-sidebar.css',
            'bower_components/angular-loading-bar/build/loading-bar.css'
        ]).
            pipe(plumberWithNotify()).
            pipe(p.using()).
            pipe(p.concat('lib-all.css')).
            pipe(gulp.dest('app/dist/css/'))
        ;   
    });


    gulp.task('compileSass', function(done) {
        gulp.src(['app/src/sass/style.scss']).
            pipe(plumberWithNotify()).
            pipe(p.concat('app-all.css')).
            pipe(p.sass()).
            pipe(p.autoprefixer()).
            pipe(gulp.dest('app/dist/css/')).
            on('end', done)
        ;
    });


    gulp.task('concatCss', ['compileSass'], function(done) {
        gulp.src(['app/dist/css/app-all.css','app/dist/css/lib-all.css']).
            pipe(p.concat('all.css')).
            pipe(gulp.dest('app/dist/css/')).
            on('end', done)
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
            pipe(gulp.dest('app/dist/js/'))
        ;   
    });


    gulp.task('concatJs', function(done) {
        gulp.src(['app/src/**/*.js', '!app/src/**/app.module.js', '!app/src/**/*.spec.js']).
            pipe(plumberWithNotify()).
            pipe(p.using()).
            pipe(p.concat('app-all.js')).
            pipe(gulp.dest('app/dist/js/')).
            on('end', function(){
                gulp.src(['app/src/**/app.module.js', 'app/dist/js/app-all.js']).
                    pipe(p.concat('app-all.js')).
                    pipe(gulp.dest('app/dist/js/')).
                    on('end', function(){
                        gulp.src(['app/dist/js/lib-all.js', 'app/dist/js/app-all.js']).
                            pipe(p.concat('all.js')).
                            pipe(gulp.dest('app/dist/js/')).
                            on('end', done);
                    });
            })
        ;
    });

    gulp.task('jsMinify', ['concatJs'], function(done) {
        return gulp.src(['app/dist/js/all.js']).
            pipe(p.concat('all.min.js')).
            pipe(p.uglify()).
            pipe(gulp.dest('app/dist/js/'))
        ;
    });


    gulp.task('server', function(){
        return browser({
            port: '3010',
            server: {
                baseDir: './app/dist/'
            }
        });
    })

    gulp.task('watch', function(done){
        gulp.watch(['app/src/**/*.scss'], ['concatCss', browser.reload]);
        gulp.watch(['app/src/**/*.js'], ['concatJs', browser.reload]);
        gulp.watch(['app/src/**/*.html'], ['copyHtml', browser.reload]);
        done();
    });


    gulp.task('default', ['clean'], function(){

        runSequence(
            'copyResource',
            'copyHtml',
            'concatCssLib',
            'concatCss',
            'concatJsLib',
            'concatJs',
            'server',
            'watch',
            browser.reload
        );

    });

})();

