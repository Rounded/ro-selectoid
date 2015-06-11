var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var angularTemplates = require('gulp-angular-templates');

var gls = require('gulp-live-server');

gulp.task('templates', function() {
  var stream = gulp.src('src/templates/*.html')
    .pipe(angularTemplates({
      module: 'ro.selectoid',
      standalone: false
    }))
    .pipe(gulp.dest('tmp/angular-templates'));
  return stream;
});

gulp.task('typescript', function() {
  var stream = gulp.src('src/ts/**/*.ts')
    .pipe(typescript({
      declaration: true,
      removeComments: true,
      sourceMap: true
    }))
    .pipe(gulp.dest('tmp/js'))
  return stream;
});

gulp.task('js', ['typescript', 'templates'], function() {
  var stream = gulp.src([
    'tmp/js/_module.js',
    'tmp/js/*.js',
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
})

gulp.task('serve', ['build'], function() {
  var server = gls.static('.', 8080);
  server.start();
  
  gulp.watch(['dist/*.js'], function() {
    server.notify.apply(server, arguments);
  });
  
  gulp.watch(['src/templates/*.html', 'src/ts/*.ts'], ['js']);
})

gulp.task('build', ['js', 'minify']);

gulp.task('default', ['build']);
