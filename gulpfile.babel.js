import gulp from 'gulp';
import cp from 'child_process';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('jekyll:build', done => {
  return cp.spawn('jekyll.bat', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll:rebuild', ['jekyll:build'], () => {
  reload;
});

gulp.task('images', () => {
  return gulp.src('src/img/**')
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'images'}));
});

gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = ['last 2 versions, > 5%'];

  return gulp.src(['styles/**/*.scss'])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['bower_components/susy/sass'],
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('_site/styles'))
    .pipe($.size({title: 'styles'}));
});

gulp.task('serve', ['styles', 'jekyll:build', 'images'], () => {
  const DIRS = ['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*.html'];

  browserSync({
    server: '_site'
  });

  gulp.watch(['styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(DIRS, ['jekyll:rebuild']);
  //gulp.watch(['dist/scripts/**/*.js'], ['jshint']);
  //gulp.watch(['dist/images/**/*'], reload);
});

gulp.task('default', ['serve']);
