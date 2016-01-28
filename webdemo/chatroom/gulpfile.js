var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    precss = require("precss"),
    puer = require("puer");
gulp.task('lint', function  () {
    gulp.src(['./src/js/**/*.js','./src/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('move', function () {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'));
})
gulp.task('puer', function() {
    puer();
});
gulp.task('css', function () {
    var processors = [
        precss,
        autoprefixer({browers:['last 2 versions']})      
    ];
    return gulp.src('src/css/index.css')
        .pipe(postcss(processors))
        .pipe(rename('chartroom.css'))
        .pipe(gulp.dest('dist/css'));
});
gulp.task('watch',function(){
    gulp.watch(['./src/css/**/*.css','./src/css/*.css'],['css']);
    gulp.watch('./src/js/*.js',['move']);
});
gulp.task('default', ['css','move','watch']);