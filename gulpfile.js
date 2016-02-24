'use strict';
var gulp        = require('gulp');
var browserify  = require('browserify');
var babelify    = require('babelify');
var path        = require('path')
var source      = require('vinyl-source-stream');
var del         = require('del');

function getAllFilesFromFolder(dir) {
  var filesystem = require("fs");
  var results = [];
  
  filesystem.readdirSync(dir).forEach(function(file) {

      file = dir+'/'+file;
      var stat = filesystem.statSync(file);

      if (!stat.isDirectory()) {
        results.push(file);
      }
  });

  return results;
}

var paths = {
  js: {
    src: './src/js/*.js',
    dest: './public/javascripts',
    main: './public/javascripts/main.js'
  },
  css: {
    src: './src/stylesheets/*.css',
    dest: './public/stylesheets/'
  },
  libraries: {
    src: './src/js/libraries/*.js',
    dest: './public/javascripts/libraries'
  },
  images: {
    src: './src/stylesheets/images/*.png',
    dest: './public/stylesheets/images'
  },
  dest: './public'
};

var jsFiles = getAllFilesFromFolder('./src/js');

gulp.task('clean', function () {
	return del(paths.dest, { force: true });
});

gulp.task('css', function () {
  return gulp.src(paths.css.src).pipe(gulp.dest(paths.css.dest));
});

gulp.task('images', function() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
});

gulp.task('libraries', function() {
  return gulp.src(paths.libraries.src).pipe(gulp.dest(paths.libraries.dest));
});

gulp.task('js', function() {
  return browserify({entries: jsFiles, debug: true})
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(source(path.basename(paths.js.main)))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('default', ['css', 'images', 'libraries', 'js']);

gulp.task('watch', ['default'], function() {
  gulp.watch(paths.css.src, ['css']);
  gulp.watch(paths.images.src, ['images']);
  gulp.watch(paths.libraries.src, ['libraries']);
  gulp.watch(paths.js.src, ['js']);
});
