/*jslint node:true*/

var jslint = require('./jslint.js');

/**
 * Run JSLint against a series of files and repond with a report
 *
 * @async
 * @param  {Array}    files      The files to lint
 * @param  {Object}   directives JSLint directives `{unparam: true, node: true}`
 * @param  {Function} next       Callback: `function (err, report)`
 */
function runner(files, directives, next) {
	'use strict';

	var report = {
			'files': {},
			'failures': 0,
			'file_count': files.length,
			'files_in_violation': 0
		},
		pending = files.length;

	files.forEach(function (file) {

		jslint(file, directives, function (err, errors) {

			if (err) {
				return next(err);
			}

			report.files[file] = errors;

			if (errors.length) {
				report.failures += errors.length;
				report.files_in_violation += 1;
			}

			pending -= 1;
			if (!pending) {
				return next(null, report);
			}

		});
	});
}

module.exports = runner;
