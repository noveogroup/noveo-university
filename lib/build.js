'use strict';

var fs = require('fs');
var path = require('path');
var metalsmith = require('metalsmith');
var yaml = require('js-yaml');
var VError = require('verror');

var templates = require('metalsmith-templates');
var markdownIt = require('metalsmith-markdownit');
var collections = require('metalsmith-collections');
var paths = require('metalsmith-paths');
var asset = require('metalsmith-static');
var concat = require('./metalsmith-concat');

function sortFn(a, b) {
  if(a.path.name > b.path.name) {
    return 1;
  }
  if (a.path.name < b.path.name){
    return -1;
  }
  return 0;
}

var root = path.join(__dirname, '../');

/**
 *
 * Build presentation
 *
 * @param {String} source - Sources path
 * @param {String} destination - Destination path
 * @param {Boolean} clean - Clean destination derictory before build or not
 * @param {Function} cb - Callback
 *
 */

module.exports = function(source, destination, clean, cb) {
  var metaFile = path.join(source, 'meta.yml');
  var meta;
  try {
    meta = yaml.safeLoad(fs.readFileSync(metaFile, 'utf8'));
  } catch (err) {
    return cb(new VError(err, 'Failed to read metadata'));
  }
  metalsmith(root)
    .source(source)
    .destination(destination)
    .ignore('meta.yml')
    .metadata(meta)
    .use(asset({
      src: 'public',
      dest: 'public'
    }))
    .clean(clean)
    .use(paths())
    .use(collections({
      slides: {
        pattern: '*.md',
        sortBy: sortFn
      }
    }))
    .use(markdownIt({
      html: true
    }))
    .use(templates({
      engine: 'jade',
      'default': 'slide.jade',
      pretty: true
    }))
    .use(concat({
      pattern: '*.html',
      filename: 'index.html'
    }))
    .use(templates({
      engine: 'jade',
      'default': 'presentation.jade',
      pretty: true
    }))
    .build(function(err) {
      if (err) {
        return cb(new VError(err, 'Build failed'));
      }
      cb();
    });
};
