var merge = require('lodash/object/merge');

module.exports = JSONFile;

function JSONFile() {
  this._content = {};
}

JSONFile.prototype.add = function(content) {
  content = JSON.parse(content);
  this._content = merge({}, this._content, content);
}

JSONFile.prototype.content = function() {
  return new Buffer(JSON.stringify(this._content));
}
