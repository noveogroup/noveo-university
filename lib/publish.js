'use strict';

var build = require('./build');
var ghpages = require('gh-pages');


/**
 *
 * Build presentation and publish it to the gh-pages
 *
 * @param {String} source - Sources path
 * @param {String} destination - Destination path
 * @param {Function} cb - Callback
 *
 */

module.exports = function(source, destination, cb) {
  build(source, destination, true, function(err) {
    if (err) {
      return cb(err);
    }
    ghpages.publish(destination, {
      message: 'Updates '+ (new Date()).toString()
    }, function(err) {
      if (err) {
        return cb(err);
      }
      cb(null, 'Publish successful!');
    });
  });
};
