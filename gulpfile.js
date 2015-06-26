'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
  dest: 'public',
  scripts: [
    'node_modules/reveal.js/js/reveal.js'
  ],
  copy: [
    'node_modules/reveal.js/css/print/paper.css',
    'node_modules/reveal.js/css/print/pdf.css'
  ],
  scss: {
    src: 'styles/styles.scss',
    watch: 'styles/*.scss'
  },
  svg: [
    'university-logo.svg'
  ]
};


gulp.task('build', ['jslint', 'scripts', 'styles', 'copy', 'images']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');

  gulp.watch(paths.scss.watch, ['styles']);
});

gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function() {
  return gulp.src(paths.scss.src)
    .pipe($.plumber())
    .pipe($.sass({
      outputStyle: 'expanded',
      includePaths: [
        'node_modules/',
        'styles/',
      ]
    }))
    .pipe($.plumber())
    .pipe($.postcss([
      require('autoprefixer-core')(),
      require('css-mqpacker'),
      /*require('csswring')({
        preserveHacks: true,
        removeAllComments: true
      })*/
    ]))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('images', function() {
  return gulp.src(paths.svg)
    .pipe($.svgmin())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('copy', function() {
  gulp.src(paths.copy)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('clean', function(cb) {
  var del = require('del');
  del('public', cb);
});

gulp.task('jslint', function() {
  return gulp.src([
      'gulpfile.js',
      'lib/*',
      'bin/noveo-university'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.jshint.reporter('fail'));
});
