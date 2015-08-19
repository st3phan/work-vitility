'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var glob = require('glob');
var path = require('path');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src([
            'app/js/**/*.js',
            '!app/js/vendor/**/*.js'
        ])
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function () {
    return gulp.src([
            'app/images/**/*'
        ])
        .pipe($.if('!**/*.svg', $.cache(
            $.imagemin({
                progressive: true,
                interlaced: true
            })
        )))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});

// Process SVG
gulp.task('svg', function() {

    var minimize = gulp.src('app/images/svg/src/**/*.svg')
        .pipe($.svgmin())
        .pipe(gulp.dest('app/images/svg/min'));
        
    var monochrome = gulp.src('app/images/svg/min/monochrome/*.svg')
        .pipe($.svgstore({
            fileName: 'sprite.svg',
            prefix: 'icon-',
            inlineSvg: true,
            transformSvg: function($svg, done) {
                $svg.find('[fill]').removeAttr('fill');
                done(null, $svg);
            }
        }))
        .pipe(gulp.dest('app/images/svg/sprite'));
        
    var colored = gulp.src('app/images/svg/min/colored/*.svg')
        .pipe($.svgstore({
            fileName: 'sprite-colored.svg',
            prefix: 'icon-',
            inlineSvg: true
        }))
        .pipe(gulp.dest('app/images/svg/sprite'));
        
    return merge(minimize, monochrome, colored);

});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'fonts'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {

    var html = gulp.src(['app/*','!app/*.html'])
        .pipe(gulp.dest('dist'));
    
    var vendor = gulp.src('app/js/vendor/*')
        .pipe(gulp.dest('dist/js/vendor'));
        
    var ajax = gulp.src('app/ajax/*')
            .pipe(gulp.dest('dist/ajax'))
            .pipe($.size({title: 'copy'}));
            
    return merge(html, vendor, ajax);
});

// Compile Sass files
gulp.task('styles:scss', function() {
    return gulp.src('app/styles/scss/*.scss')
        .pipe($.compass({
            project: path.join(__dirname, 'app'),
            css: 'styles',
            sass: 'styles/scss'
        }).on('error', function(err) {
            this.emit('end');
        }))
        .pipe($.size({title: 'styles:scss'}));
});

gulp.task('styles', ['styles:scss']);

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe($.useref.assets({searchPath: 'app'}))
        // Concatenate And Minify JavaScript
        .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
        // Concatenate And Minify Styles
        .pipe($.if('*.css', $.csso()))
        .pipe($.useref.restore())
        .pipe($.useref())
        // Output Files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist']));

// Watch Files For Changes & Reload
gulp.task('serve', ['watch'], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: 'app'
        }
    });
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
    
    gulp.watch(['dist/**/*'], reload);
});

// Watch Files For Changes & Reload
gulp.task('watch', function() {
    gulp.watch(['app/js/**/*.js'], ['jshint']);
    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    gulp.watch(['app/styles/**/*.css'], reload);
    gulp.watch(['app/images/**/*'], reload);
    gulp.watch(['app/images/svg/src/**/*.svg'], ['svg']);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
    runSequence('styles', 'svg', ['jshint', 'html', 'images', 'fonts', 'copy'], cb);
});
