# gulp-jsonmerge
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> jsonmerge plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-jsonmerge` as a development dependency:

```shell
npm install --save-dev gulp-jsonmerge
```

Then, add it to your `gulpfile.js`:

** This plugin will collect all the json files provided to it, parse them, put them in a file**

```javascript
var jsonmerge = require("gulp-jsonmerge");

gulp.src("./src/*.json")
	.pipe(jsonmerge("result.js"))
	.pipe(gulp.dest("./dist"));
```

## API

### jsonmerge(fileName)

#### fileName
Type: `String`  

The output filename


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-jsonmerge
[npm-image]: https://badge.fury.io/js/gulp-jsonmerge.png

[travis-url]: http://travis-ci.org/reflog/gulp-jsonmerge
[travis-image]: https://secure.travis-ci.org/reflog/gulp-jsonmerge.png?branch=master

[coveralls-url]: https://coveralls.io/r/reflog/gulp-jsonmerge
[coveralls-image]: https://coveralls.io/repos/reflog/gulp-jsonmerge/badge.png

[depstat-url]: https://david-dm.org/reflog/gulp-jsonmerge
[depstat-image]: https://david-dm.org/reflog/gulp-jsonmerge.png
