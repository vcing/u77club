var gulp  = require('gulp');
var sass  = require('gulp-sass');
var concat = require('gulp-concat');
var delay = 1000;

gulp.task('default',function(){
	
});

gulp.watch('./static/src/**/*.js',function(event){
	console.log('rebuild file:'+event.path);
	// var path = event.path.split('/js')[1];
	// var _path = path.split('/');
	// var name = _path[_path.length-1];
	// path = path.replace(name,'');
	setTimeout(function(){
		// gulp.src(event.path)
		// 	.pipe(gulp.dest('./static/dest/js'+path));
		gulp.src('./static/src/**/*.js')
			.pipe(concat('common.js'))
			.pipe(gulp.dest('./static/dest/js'));
	},delay);

});

gulp.watch('./static/src/**/*.js.map',function(event){
	console.log('rebuild file:'+event.path);
	var path = event.path.split('/js')[1];
	var _path = path.split('/');
	var name = _path[_path.length-1];
	path = path.replace(name,'');
	setTimeout(function(){
		gulp.src(event.path)
			.pipe(gulp.dest('./static/dest/js'+path));
	},delay);
});

gulp.watch('./static/src/**/*.scss',function(event){
	console.log('rebuild file:'+event.path);
	setTimeout(function(){
		gulp.src(event.path)
			.pipe(sass().on('error',sass.logError))
			.pipe(gulp.dest('./static/dest/css'));
	},delay);
});

gulp.watch('./static/src/**/*.html',function(event){
	console.log('rebuild file:'+event.path);
	setTimeout(function(){
		var path = event.path.split('/html')[1];
		var _path = path.split('/');
		var name = _path[_path.length-1];
		path = path.replace(name,'');
		gulp.src(event.path)
			.pipe(gulp.dest('./static/dest/'+path));
	},delay);
})
