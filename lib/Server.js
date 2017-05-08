"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Spin up a simple pushstate server */


var _pushstateServer = require("pushstate-server");

var _pushstateServer2 = _interopRequireDefault(_pushstateServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
  function Server(baseDir, file, port) {
    var _this = this;

    _classCallCheck(this, Server);

    this.start = function () {
      return new Promise(function (resolve, reject) {
        _this.instance = _pushstateServer2.default.start({
          port: port,
          directories: [baseDir],
          file: file
        });
        setTimeout(resolve, 1000); /* fuckn node apis how can you tell when a connect server is ready to accept connections when you dont have the internet because you're on a plane fkn */
      });
    };
  }

  _createClass(Server, [{
    key: "stop",
    value: function stop() {
      console.log("\nServer stopped.");
      this.instance.close();
      process.exit(); /* fkn dunno why this doesnt work eh */
    }
  }]);

  return Server;
}();

exports.default = Server;
module.exports = exports["default"];