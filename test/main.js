/*global describe, it*/
"use strict";

var fs = require("fs"),
  es = require("event-stream"),
  should = require("should");

require("mocha");

delete require.cache[require.resolve("../")];

var gutil = require("gulp-util"),
  jsonmerge = require("../");

describe("gulp-jsonmerge", function() {

  var expectedFile = new gutil.File({
    path: "test/expected/user.json",
    cwd: "test/",
    base: "test/expected",
    contents: fs.readFileSync("test/expected/user.json")
  });

  it("should produce expected file via buffer", function(done) {

    var srcFile = new gutil.File({
      path: "test/fixtures/user.json",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.readFileSync("test/fixtures/user.json")
    });

    var srcFileToMerge = new gutil.File({
      path: "test/fixtures/toMerge.json",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.readFileSync("test/fixtures/toMerge.json")
    });

    var stream = jsonmerge("World");

    stream.on("data", function(newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);

      should.deepEqual(JSON.parse(newFile.contents), JSON.parse(expectedFile.contents));
      done();
    });
    stream.write(srcFile);
    stream.write(srcFileToMerge);
    stream.end();
  });

  it("should error on stream", function(done) {
    var srcFile = new gutil.File({
      path: "test/fixtures/user.json",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.createReadStream("test/fixtures/user.json")
    });

    var stream = jsonmerge("World");

    stream.on("error", function(err) {
      err.message.should.equal("Streaming not supported");
      done();
    });

    stream.on("data", function(newFile) {
      should.fail(null, null, "should never get here");
    });

    stream.write(srcFile);
    stream.end();
  });

  it("should error when parsing JSON in source file", function(done) {
    var srcFile = new gutil.File({
      path: "test/fixtures/badUser.json",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.readFileSync("test/fixtures/badUser.json")
    });

    var stream = jsonmerge("World");

    stream.on("error", function(err) {
      err.message.should.equal("Error parsing JSON: SyntaxError: Unexpected token l, file: /badUser.json");
      done();
    });

    stream.on("data", function(newFile) {
      console.log(newFile)
      should.fail(null, null, "should never get here");
    });

    stream.write(srcFile);
    stream.end();
  });
});
