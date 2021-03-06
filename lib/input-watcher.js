// Generated by CoffeeScript 1.4.0
(function() {
  var Formwatcher, InputWatcher, bonzo;

  bonzo = require("bonzo");

  Formwatcher = require("./formwatcher");

  InputWatcher = (function() {

    InputWatcher.prototype.name = "No name";

    InputWatcher.prototype.description = "No description";

    InputWatcher.prototype.nodeNames = null;

    InputWatcher.prototype.classNames = [];

    InputWatcher.prototype.defaultOptions = {};

    InputWatcher.prototype.options = null;

    function InputWatcher(options, watcher) {
      this.watcher = watcher;
      this.options = Formwatcher.deepExtend({}, this.defaultOptions, options);
    }

    InputWatcher.prototype.accepts = function(input) {
      var className, correctClassNames, correctNodeName, inputNodeName, nodeName, _i, _j, _len, _len1, _ref, _ref1;
      correctNodeName = false;
      inputNodeName = input.nodeName;
      _ref = this.nodeNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nodeName = _ref[_i];
        if (inputNodeName === nodeName) {
          correctNodeName = true;
          break;
        }
      }
      if (!correctNodeName) {
        return false;
      }
      correctClassNames = true;
      _ref1 = this.classNames;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        className = _ref1[_j];
        if (!bonzo(input).hasClass(className)) {
          correctClassNames = false;
          break;
        }
      }
      return correctClassNames;
    };

    return InputWatcher;

  })();

  module.exports = InputWatcher;

}).call(this);
