var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less',function(){
	return gulp.src('./public/less/main.less')
	.pipe(less())
	.pipe(gulp.dest('./public/stylesheets'));
})

gulp.task('watch',function(){
	gulp.watch('./public/less/main.less',['less'])
})
