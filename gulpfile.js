var gulp = require('gulp');

gulp.task('copy-assets', function() {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

//lint ===================================================
var sassLint = require('gulp-sass-lint');
gulp.task('sass-lint', function() {
  return gulp.src(['sass/**/*.s+(a|c)ss', '!sass/atoms/_reset.scss', '!sass/atoms/_fonts.scss', '!sass/styleguide.scss'])
    .pipe(sassLint())
    .pipe(sassLint.format());
  // .pipe(sassLint.failOnError())
});

//HTML ===================================================
var nunjucks = require('gulp-nunjucks-html');
var extReplace = require('gulp-ext-replace');
var plumber = require('gulp-plumber');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject-string');

gulp.task('html', function() {
  return gulp.src('html/**/*.nun')
    .pipe(plumber())
    .pipe(nunjucks({searchPaths: ['html', 'dist/', 'js']}))
    .pipe(extReplace('.html'))
    .pipe(htmlmin({collapseWhitespace: false, minifyCSS: true, minifyJS: true}))
    .pipe(gulp.dest('dist/'));
});

//SASS ===================================================
// Compile sass into CSS & auto-inject into browsers
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var date = new Date();
var gcmq = require('gulp-group-css-media-queries');
var insert = require('gulp-insert');
var pjson = require('./package.json');
var sass = require('gulp-sass');
gulp.task('sass', ['sass-lint'], function() {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gcmq())
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(cssnano({zindex: false}))
    .pipe(insert.append('/*! v' + pjson.version + ' built on ' + date + ' */'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});


var concat = require('gulp-concat');
gulp.task('css', ['sass'], function() {
  return gulp.src('dist/css/style.css')
    .pipe(concat('css.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('css-dev', ['sass-dev'], function() {
	return gulp.src(['dist/css/style.css'])
		.pipe(concat('css.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('copy', function() {
	return gulp.src(['js/copy/**'])
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});


//
// //JavaScript ===================================================
// var uglify = require('gulp-uglify');
// var pump = require('pump');
//
// gulp.task('js-vanilla', function(cb) {
//   pump([
//       gulp.src(['js/native-connectors.js']),
//       concat('scripts-vanilla.js'),
//       gulp.dest('dist/js')
//     ],
//     cb
//   );
// });
//
// gulp.task('js-jquery', function(cb) {
//   pump([
//       gulp.src(['js/**/*.js', '!js/native-connectors.js']),
//       concat('scripts-jquery.js'),
//       insert.prepend('(function($) {$(function() {'),
//       insert.append('});})(jQuery);'),
//       gulp.dest('dist/js')
//     ],
//     cb
//   );
// });
//
// gulp.task('js', ['js-vanilla', 'js-jquery'], function(cb) {
//   pump([
//       gulp.src(['dist/js/pegasus.min.js', 'dist/js/scripts-vanilla.js', 'dist/js/scripts-jquery.js', 'node_modules/owl.carousel/dist/owl.carousel.min.js','node_modules/jquery-lazyload/jquery.lazyload.js']),
//       concat('scripts.js'),
//       uglify(),
//       insert.append('\n/*! v' + pjson.version + ' built on ' + date + ' */'),
//       gulp.dest('dist/js')
//     ],
//     cb
//   );
// });

//Server ===================================================
// Static Server + watching sass/html files
gulp.task('serve', ['css',  'html'], function(cb) {
  browserSync.init({server: {baseDir: './dist/', index: 'index.html'}, port: 3001});
  // gulp.watch(['js/**/*.js'], ['js', 'copy-native-connectors']);
  gulp.watch(['sass/**/*.scss'], ['css']);
  gulp.watch(['html/**/*.nun', 'html/**/*.html'], ['html']);
  gulp.watch(['dist/**/*.html']).on('change', function() {setTimeout(browserSync.reload, 200)});
  cb();
});

// Static Server for testing
gulp.task('serveDump', ['css', 'js', 'html'], function(cb) {
  browserSync.init({open: false, server: {baseDir: './dist/', index: 'index.html'}, port: 3001});
  cb();
});

//Cleaning ===================================================
var del = require('del');
gulp.task('clean', function() { return del(['dist']);});

//Generate SASS Doc ===========================================
var shell = require('gulp-shell');
gulp.task('sass-doc', shell.task(['sassdoc sass/']));

// //Generate JS Doc ===========================================
// var jsdoc = require('gulp-jsdoc3');
//
// gulp.task('js-doc', function(cb) {
//   gulp.src(['README.md', 'js/**/*.js'], {read: false})
//     .pipe(jsdoc(cb));
// });
//
// //Generate SVG Sprite ===========================================
// var svgSprite = require("gulp-svg-sprites");
// gulp.task('sprites', function() {
//   return gulp.src('assets/icons/*.svg')
//     .pipe(svgSprite({selector: 'icon-%f', svgId: "%f", mode: 'symbols', preview: false}))
//     .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
//     .pipe(gulp.dest("dist"));
// });
//
// //TEST TEST TEST ===========================================
// var exit = require('gulp-exit');
// gulp.task('runTests', function () {
//   return gulp.src('', {read: false})
//     .pipe(shell(['npm run backstopTest']))
//     .pipe(exit());
// });

//RUN =========================================================
var runSequence = require('run-sequence');
gulp.task('default', function(cb) { runSequence('clean',
	['copy-assets', 'copy'],
	'serve', cb);});

// gulp.task('default', function(cb) { runSequence('clean', ['copy-native-connectors', 'copy-owl-css', 'copy-pegasus-js', 'copy-prism-css', 'copy-prism-js', 'copy-jquery-js', 'sprites', 'copy-assets', 'copy-favicon', 'copy-mock-api','copy-mp3','copy-htaccess'], ['sass-doc', 'js-doc'], ['copy-sass-docs', 'copy-js-docs'],'serve-dev', cb);});
// gulp.task('test', function(cb) { runSequence('clean', ['copy-native-connectors', 'copy-owl-css', 'copy-pegasus-js', 'copy-prism-css', 'copy-prism-js', 'copy-jquery-js', 'sprites', 'copy-assets', 'copy-favicon', 'copy-mock-api','copy-mp3'], 'serveDump', 'runTests', cb);});
