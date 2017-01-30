var gulp = require('gulp');

var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    gulp.start('build');
    connect.server({
        root: 'dist',
        fallback: 'dist/index.html',
        livereload: true,
        port: 8080
    });
});

var paths = {
    layout: [
        'src/layouts/index.html'
    ],
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'src/assets/style.css'
    ],
    js: [
        'node_modules/lodash/lodash.js',
        'node_modules/moment/moment.js',
        'node_modules/moment-range/dist/moment-range.js',
        'node_modules/angular/angular.js',
        'src/controllers/*.js',
        'src/components/*.js',
        'src/app.js'
    ]
};

gulp.task('css', function() {
    return gulp.src(paths.css)
        .pipe(debug({ title: 'stylesheets:' }))
        .pipe(concatCss("styles.css"))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(debug({ title: 'core:' }))
        .pipe(concat('app.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/'));
});


gulp.task('layout', function() {
    return gulp.src(paths.layout)
        .pipe(debug({ title: 'view layout:' }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['css', 'js', 'layout']);


gulp.task('watch', function() {

    gulp.watch([
        'src/**/*.*'
    ], ['build']);

});

gulp.task('default', function() {
    gulp.start('build');
});