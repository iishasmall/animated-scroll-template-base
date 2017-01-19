var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var sftp = require('gulp-sftp');

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};

var sassSources = './src/scss/**/*.scss';
var sassOutput = './app/css';
var htmlSource = 'app/**/*.html';


gulp.task('sass', function(){
	return gulp.src(sassSources)
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(cleanCSS({debug:true},function(details){

		console.log(details.name + ': ' + details.stats.originalSize);
        console.log(details.name + ': ' + details.stats.minifiedSize);
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(sassOutput))
	.pipe(browserSync.stream())
});

gulp.task('serve', ['sass'], function(){

	browserSync.init({
		server: './app',
		browser: "google chrome"
	})

	gulp.watch(sassSources, ['sass'])
	gulp.watch(htmlSource).on('change', browserSync.reload);
});

gulp.task('deploy', function(){
	return gulp.src('./app/**/*')
	.pipe(sftp({
		host: 'iishasmall.com',
		user: '****',
		pass: '****',
		remotePath: '/home/i/smalli/web/'
	}));
});


gulp.task('default', ['serve']);












