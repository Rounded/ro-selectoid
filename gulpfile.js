var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var angularTemplates = require('gulp-angular-templates');

var gls = require('gulp-live-server');

gulp.task('templates', function() {
  var stream = gulp.src('src/templates/*.html')
    .pipe(angularTemplates({
      module: 'ro.selectoid',
      basePath: 'ro-selectoid/templates/',
      standalone: false
    }))
    .pipe(gulp.dest('tmp/angular-templates'));
  return stream;
});

gulp.task('js', ['templates'], function() {
  var stream = gulp.src([
    'src/js/_module.js',
    'src/js/*.js',
    'tmp/angular-templates/*.js'
  ])
    .pipe(concat('ro-selectoid.js'))
    .pipe(gulp.dest('dist'));
  return stream;
});

gulp.task('minify', ['js'], function() {
  var stream = gulp.src('dist/ro-selectoid.js')
    .pipe(uglify())
    .pipe(rename('ro-selectoid.min.js'))
    .pipe(gulp.dest('dist'));
  return stream;
});

gulp.task('serve', ['build'], function() {
  var server = gls.static('.', 8080);
  server.start();

  gulp.watch(['dist/*.js'], function() {
    server.notify.apply(server, arguments);
  });

  gulp.watch(['src/templates/*.html', 'src/js/*.js'], ['js']);
});

gulp.task('build', ['js', 'minify']);

gulp.task('default', ['build']);
