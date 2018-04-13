var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var inject = require('gulp-inject');

gulp.task('svg', function() {
    return gulp
        .src('res/svg/*.svg')
        //.pipe(svgmin())
        .pipe(svgstore())
        .pipe(gulp.dest('./res'))
        
});