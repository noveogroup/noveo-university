'use strict';

var bs = require('browser-sync').create();
var build = require('./build');

/**
 *
 * Watch sources and rebuild on changes
 * Serve presentation and reload on rebuild
 *
 * @param {String} source - Sources path
 * @param {String} destination - Destination path
 * @param {Function} cb - Callback
 *
 */

module.exports = function(source, destination, cb) {

  function rebuild() {
    if (!bs.paused) {
      bs.pause();

      build(source, destination, false, function(err) {
        if (err) {
          bs.exit();
          return cb(err);
        }
        cb(null, 'Rebuild successful!');
        bs.resume();
        bs.reload();
      });
    }
  }

  build(source, destination, true, function(err) {
    if (err) {
      bs.exit();
      return cb(err);
    }
    cb(null, 'Build successful!');

    bs.watch(source, {ignoreInitial: true}, rebuild);
    bs.init({
      server: destination
    });
  });
};
