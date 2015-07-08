'use strict';

var loaderUtils = require('loader-utils');
var assign = require('object-assign');
var path = require('path');
var spawn = require('child_process').spawn;

function beautify(content, options, callback) {
    var jscsPath = path.join(__dirname, 'node_modules', 'jscs', 'bin', 'jscs');
    var jscsArgs = [];

    jscsArgs.push('--fix')
    // jscsArgs.push(filePath)
    jscsArgs.push('--esnext')
    jscsArgs.push('--preset')
    jscsArgs.push('airbnb')

    var jscs = spawn(jscsPath, jscsArgs);

    jscs.stdout.on('data', function (data) {
        callback(null, data);
    });

    jscs.stderr.on('data', function (data) {
      console.log('jscs stderr: ' + data);
    });

    jscs.on('exit', function (code) {
        if (code !== 0) {
            console.log('jscs process exited with code ' + code);
        }
    });

    jscs.stdin.write(content);
    jscs.stdin.end();
}

module.exports = function(source, inputSourceMap) {
  var defaultOptions = {  };

  var loaderOptions = loaderUtils.parseQuery(this.query);
  var options = assign({}, defaultOptions, loaderOptions);

  this.cacheable();
  var callback = this.async();

  beautify(source, options, callback);
};
