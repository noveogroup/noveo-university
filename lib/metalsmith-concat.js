'use strict';

var minimatch = require('minimatch');

module.exports = function(options) {
  options = options || {};
  options.pattern = options.pattern || '**/*';
  options.filename = options.filename || 'index.html';

  return function(files, metalsmith, done) {
    var contents = '';
    Object.keys(files).sort().forEach(function(filename) {
      if (minimatch(filename, options.pattern)) {
        contents += files[filename].contents.toString();
        delete files[filename];
        files[options.filename] = {
          contents: new Buffer(contents)
        };
      }
    });
    done();
  };
};
