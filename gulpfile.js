var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var webserver = require('gulp-webserver');
var run = require('gulp-run');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var uglify = require("gulp-uglify");
var autoprefixer = require("gulp-autoprefixer");

gulp.task('webserver', function() {
    gulp.src('./exports')
    .pipe(
    	webserver({
    		host: '192.168.33.10',
        	livereload: true,
    	})
    );
});

gulp.task('html', function(){
  	gulp.src('./html/*.html')
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
    	.pipe(gulp.dest('exports/'));
});

gulp.task('sass', function(){
  	gulp.src('./scss/*.scss')
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
    	.pipe(sass())
        .pipe(autoprefixer())
    	.pipe(gulp.dest('exports/css'));
});

gulp.task('coffee', function(){
  	gulp.src('./coffee/*.coffee')
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
    	.pipe(coffee())
//        .pipe(uglify())
    	.pipe(gulp.dest('exports/js'));
});

gulp.task('js-lib', function(){
  	gulp.src('./js-lib/*.js')
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
    	.pipe(gulp.dest('exports/js/lib'));
});

gulp.task('img', function(){
  	gulp.src('./img/*.jpg')
    	.pipe(gulp.dest('exports/img'));
});

gulp.task('watch', function(){
	gulp.watch('./html/*.html', ['html']);
	gulp.watch('./scss/*.scss', ['sass']);
	gulp.watch('./coffee/*.coffee', ['coffee']);
	gulp.watch('./js-lib/*.js', ['js-lib']);
	gulp.run("webserver");
});

gulp.task('default', ['html', 'sass', 'coffee', 'js-lib', 'img', 'watch']);
