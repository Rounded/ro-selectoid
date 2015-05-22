var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var angularTemplates = require('gulp-angular-templates');

gulp.task('templates', function() {
  var stream = gulp.src('src/templates/*.html')
    .pipe(angularTemplates({
      module: 'ro.selectoid',
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
})

gulp.task('build', ['js', 'minify']);

gulp.task('default', ['build']);
