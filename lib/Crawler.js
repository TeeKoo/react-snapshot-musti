'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Loads a URL then starts looking for links.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Emits a full page whenever a new link is found. */


var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _snapshot = require('./snapshot');

var _snapshot2 = _interopRequireDefault(_snapshot);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Crawler = function () {
  function Crawler(baseUrl) {
    _classCallCheck(this, Crawler);

    this.baseUrl = baseUrl;

    var _url$parse = _url2.default.parse(baseUrl);

    var protocol = _url$parse.protocol;
    var host = _url$parse.host;
    var path = _url$parse.path;

    this.protocol = protocol;
    this.host = host;
    this.paths = [path];
    this.processed = {};
  }

  _createClass(Crawler, [{
    key: 'crawl',
    value: function crawl(handler) {
      this.handler = handler;
      console.log('🕷   Starting crawling ' + this.baseUrl);
      return this.snap().then(function () {
        return console.log('🕸   Finished crawling.');
      });
    }
  }, {
    key: 'snap',
    value: function snap() {
      var _this = this;

      var path = this.paths.shift();
      if (!path) return Promise.resolve();
      if (this.processed[path]) {
        return this.snap();
      } else {
        this.processed[path] = true;
      }
      return (0, _snapshot2.default)(this.protocol, this.host, path).then(function (window) {
        var html = _jsdom2.default.serializeDocument(window.document);
        _this.extractNewLinks(window, path);
        _this.handler({ path: path, html: html });
        return _this.snap();
      }, function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'extractNewLinks',
    value: function extractNewLinks(window, currentPath) {
      var _this2 = this;

      var document = window.document;
      var tagAttributeMap = {
        'a': 'href',
        'iframe': 'src'
      };

      Object.keys(tagAttributeMap).forEach(function (tagName) {
        var urlAttribute = tagAttributeMap[tagName];
        Array.from(document.querySelectorAll(tagName + '[' + urlAttribute + ']')).forEach(function (element) {
          var _url$parse2 = _url2.default.parse(element.getAttribute(urlAttribute));

          var protocol = _url$parse2.protocol;
          var host = _url$parse2.host;
          var path = _url$parse2.path;

          if (protocol || host || !path) return;
          var relativePath = _url2.default.resolve(currentPath, path);
          if (!_this2.processed[relativePath]) _this2.paths.push(relativePath);
        });
      });
    }
  }]);

  return Crawler;
}();

exports.default = Crawler;
module.exports = exports['default'];
