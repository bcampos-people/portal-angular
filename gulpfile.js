/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */

'use strict';

var fs = require('fs');
var gulp = require('gulp');
var del = require('del');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

//gulp.task('copy', function(){
//    console.log('Iniciando a cópia dos arquivos para a pasta dist');
//    return gulp.src([__dirname + '/src/index.html',
//    __dirname + '/src/*/**.css',
//    __dirname + '/src/*/**.js'])
//    .pipe(gulp.dest(__dirname + '/dist'));
//
//gulp.task('clean', function () {
//  del.sync(__dirname + '/dist/**');
//});
