var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var JSONFile = require('./jsonFile');


// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
  if (!file) {
    throw new PluginError('gulp-mergejson', 'Missing file option for gulp-mergejson');
  }
  opt = opt || {};

  var latestFile;
  var latestMod;
  var fileName;
  var concat;
  var skipMerge = false;

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new PluginError('gulp-mergejson', 'Missing path in file options for gulp-mergejson');
  }

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      skipMerge = true;
      cb();
      return;
    }

    // we don't do streams (yet)
    if (file.isStream()) {
      skipMerge = true;
      this.emit('error', new PluginError('gulp-mergejson', 'Streaming not supported'));
      cb();
      return;
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    // construct concat instance
    if (!concat) {
      concat = new JSONFile();
    }

    // add file to concat instance
    try {
      concat.add(file.contents);
    } catch (err) {
      skipMerge = true;
      this.emit('error', new PluginError('gulp-jsoncombine', 'Error parsing JSON: ' + err + ', file: ' + file.path.slice(file.base.length)));
      cb();
      return;
    }
    cb();
  }

  function endStream(cb) {
    // no files passed in, no file goes out
    if (!latestFile || !concat || skipMerge) {
      cb();
      return;
    }

    var joinedFile;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof file === 'string') {
      joinedFile = latestFile.clone({
        contents: false
      });
      joinedFile.path = path.join(latestFile.base, file);
    } else {
      joinedFile = new File(file);
    }

    joinedFile.contents = concat.content();

    this.push(joinedFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
};
