var path = require('path');
var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');
var conf = require('./conf');
var args = require('get-gulp-args')();
var rename = require('gulp-rename');
var profile = process.env.profile = args.profile || 'dev';

gulp.task('profile', function () {

    gulp
            .src(path.join(conf.paths.cfgs, '/' + profile + '.constants.json'))
            .pipe(gulpNgConfig('portalClient', {
                wrap: '(function () {\n\'use strict\';\n\n <%= module %> \n\n})();',
                createModule: false
            }))
            .pipe(rename('index.constants.js'))
            .pipe(gulp.dest(path.join(conf.paths.src + '/app', '/')));
});