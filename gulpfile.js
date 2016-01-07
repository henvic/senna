'use strict';

var connect = require('gulp-connect');
var gulp = require('gulp');
var header = require('gulp-header');
var metal = require('gulp-metal');
var runSequence = require('run-sequence');

// Metal -----------------------------------------------------------------------

metal.registerTasks({
	bundleCssFileName: 'senna.css',
	bundleFileName: 'senna.js',
	globalName: 'senna',
	mainBuildJsTasks: ['build:globals'],
	moduleName: 'senna',
	testBrowsers: ['Chrome', 'Firefox', 'Safari', 'IE10 - Win7', 'IE11 - Win7'],
	testSaucelabsBrowsers: {
		sl_chrome: {
			base: 'SauceLabs',
			browserName: 'chrome'
		},
		sl_safari_8: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '8'
		},
		sl_safari_9: {
			base: 'SauceLabs',
			browserName: 'safari',
			version: '9'
		},
		sl_firefox: {
			base: 'SauceLabs',
			browserName: 'firefox'
		},
		sl_ie_10: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '10'
		},
		sl_ie_11: {
			base: 'SauceLabs',
			browserName: 'internet explorer',
			platform: 'Windows 8.1',
			version: '11'
		},
		sl_iphone: {
			base: 'SauceLabs',
			browserName: 'iphone',
			platform: 'OS X 10.10',
			version: '9.2'
		},
		sl_android_4: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '4.4'
		},
		sl_android_5: {
			base: 'SauceLabs',
			browserName: 'android',
			platform: 'Linux',
			version: '5.0'
		}
	}
});

gulp.task('ci', function(cb) {
  if (process.env.SAUCE_USERNAME) {
    return runSequence('lint', 'test:saucelabs', 'build', cb);
  }

  console.warn('Not running tests on SauceLabs browsers (most likely due to security restrictions)');
  console.warn('See https://docs.travis-ci.com/user/sauce-connect/ for help');
  return runSequence('lint', 'test', 'build', cb);
});

// Helpers ---------------------------------------------------------------------

gulp.task('banner', function() {
	var stamp = [
		'/**',
		' * Senna.js - <%= description %>',
		' * @author <%= author.name %> <<%= author.email %>>',
		' * @version v<%= version %>',
		' * @link http://sennajs.com',
		' * @license BSD-3-Clause',
		' */',
		''
	].join('\n');

	return gulp.src('build/globals/*.js')
		.pipe(header(stamp, require('./package.json')))
		.pipe(gulp.dest('build/globals'));
});

// Runner ----------------------------------------------------------------------

gulp.task('default', function(done) {
	runSequence('build', 'banner', done);
});

gulp.task('server', ['default'], function() {
	connect.server({
		port: 8888
	});
});