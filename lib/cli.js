'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Server = require('./Server');

var _Server2 = _interopRequireDefault(_Server);

var _Crawler = require('./Crawler');

var _Crawler2 = _interopRequireDefault(_Crawler);

var _Writer = require('./Writer');

var _Writer2 = _interopRequireDefault(_Writer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var baseDir = _path2.default.resolve('./build');
  var writer = new _Writer2.default(baseDir);
  writer.move('index.html', '200.html');

  var server = new _Server2.default(baseDir, '/200.html', 2999);
  server.start().then(function () {

    var crawler = new _Crawler2.default("http://localhost:2999");
    return crawler.crawl(function (_ref) {
      var path = _ref.path;
      var html = _ref.html;

      var filename = '' + path + (path.endsWith('/') ? 'index' : '') + '.html';
      console.log('✏️   Saving ' + path + ' as ' + filename);
      writer.write(filename, html);
    });
  }).then(function () {
    return server.stop();
  }, function (err) {
    return console.log(err);
  });
};

module.exports = exports['default'];