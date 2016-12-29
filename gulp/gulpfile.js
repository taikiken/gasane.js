/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2015/03/16 - 14:54
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
// ----------------------------------------------------------------
"use strict";

// node Module
var require = require;

// Gulp Module
var gulp = require( 'gulp' );

var runSequence = require('run-sequence');
var size = require('gulp-size');

var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var uglifyjs = require( 'gulp-uglifyjs' );
var uglify = require( 'gulp-uglify' );

var shell = require( 'gulp-shell' );

var plumber = require( 'gulp-plumber' );

var changed = require('gulp-changed');

var cache = require('gulp-cache');

var rimraf = require('rimraf');
var del = require('del');

var path = require( 'path' );

var cached = require( 'gulp-cached' );

// var yuidoc = require( 'gulp-yuidoc' );

var replace = require('gulp-replace-task');

// var jshint = require('gulp-jshint');

var eslint = require('gulp-eslint');

// ----------------------------------------------------------------
// Directory
var dir = require( './setting.js' ).dir;

// ----------------------------------------------------------------
// package
var pac = require( './package.json' );
var repository = pac.repository.url;

// ----------------------------------------------------------------
// patterns, replace task
var patterns = [
  {
    match: 'version',
    replacement: pac.version
  },
  {
    match: 'buildTime',
    replacement: new Date().toLocaleString()
  },
  {
    match: 'year',
    replacement: new Date().getFullYear()
  },
  {
    match: 'repository',
    replacement: repository
  }
];
// ----------------------------------------------------------------
//  scripts
// ----------------------------------------------------------------
var libName = 'gasane.js';
var scripts = [];

scripts.push( dir.src + '/Gasane.js' );


scripts.push( dir.src + '/event/EventDispatcher.js' );
scripts.push( dir.src + '/event/Cycle.js' );
scripts.push( dir.src + '/event/Polling.js' );
scripts.push( dir.src + '/event/Fps.js' );

// ----------------------------------------------------------------
//  task
// ----------------------------------------------------------------
// concat to libs
gulp.task( 'script-concat', function () {

  return gulp.src( scripts )
    .pipe( concat( libName ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( rename( function ( path ) {

      path.basename = path.basename + '-' + pac.version;

    } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( size( { title: '*** script-concat ***' } ) );

} );

// min inside libs
gulp.task( 'script-min', function (){

  return gulp.src(
    [
      dir.libs + '/*.js',

      '!' + dir.libs + '/*.min.js'
    ] )
    .pipe( uglify( { preserveComments: 'some' } ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( size( { title: '*** script-min ***' } ) );

} );

// build time, version
gulp.task( 'script-version', function () {

  return gulp.src( dir.libs + '/*.js' )
    .pipe( replace( { patterns: patterns } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( size( { title: '*** script-version ***' } ) );

} );

// // YUIDocs
// gulp.task( 'script-docs', function () {
//
//   return gulp.src( scripts )
//     .pipe( yuidoc.parser() )
//     .pipe( yuidoc.generator() )
//     .pipe( gulp.dest( dir.docs ) );
// } );

// // Lint JavaScript
// gulp.task('script-hint', function () {
//   return gulp.src( [
//     dir.src + '/**/*.js'
//   ] )
//     //.pipe(reload({stream: true, once: true}))
//     .pipe(jshint())
//     .pipe(jshint.reporter('jshint-stylish'));
// });


// ESLint
gulp.task('js:eslint', function() {
  return gulp.src(dir.src + '/**/*.js')
    .pipe(eslint({
      useEslintrc: false,
      configFile: '../eslint.es5.yml'
    }))
    .pipe(eslint.format())
    .pipe(size( { title: '*** js:eslint ***' } ) );
});

// ----------------------------------------------------------------
// build
gulp.task( 'script-build', function () {

  runSequence(
    'js:eslint',
    'script-concat',
    'script-min',
    // 'script-hint',
    'script-version'
  );

} );

gulp.task( 'build', ['script-build'], function () {} );

//// build with docs
//gulp.task( 'script-build-api', function () {
//
//  runSequence(
//    'script-concat',
//    'script-min',
//    'script-version',
//    'script-docs'
//  );
//
//} );
