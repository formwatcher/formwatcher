// Generated by CoffeeScript 1.4.0
(function() {
  var Formwatcher, Watcher, bean, bonzo, inputSelector, qwery, request,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  Formwatcher = require("./formwatcher");

  bonzo = require("bonzo");

  qwery = require("qwery");

  request = require("superagent");

  bean = require("bean");

  inputSelector = "input, textarea, select, button";

  Watcher = (function() {

    function Watcher(form, options) {
      var Decorator, Validator, element, hiddenSubmitButtonElement, input, submitButtons, _fn, _fn1, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
        _this = this;
      this.$form = typeof form === "string" ? bonzo(qwery(form)) : bonzo(form);
      if (this.$form.length < 1) {
        throw "Form element not found.";
      } else if (this.$form.length > 1) {
        throw "More than one form was found.";
      } else if (this.$form.get(0).nodeName !== "FORM") {
        throw "The element was not a form.";
      }
      this.form = this.$form[0];
      this.allElements = [];
      this.id = Formwatcher.currentWatcherId++;
      Formwatcher.add(this);
      this.observers = {};
      this.$form.fwData("watcher", this);
      this.$form.fwData("originalAction", this.$form.attr("action") || "").attr("action", "javascript:undefined;");
      this.options = Formwatcher.deepExtend({}, Formwatcher.defaultOptions, options || {});
      this.decorators = [];
      this.validators = [];
      _ref = Formwatcher.decorators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        Decorator = _ref[_i];
        this.decorators.push(new Decorator((_ref1 = this.options[Decorator.prototype.name]) != null ? _ref1 : {}, this));
      }
      _ref2 = Formwatcher.validators;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        Validator = _ref2[_j];
        this.validators.push(new Validator((_ref3 = this.options[Validator.prototype.name]) != null ? _ref3 : {}, this));
      }
      if (this.options.ajaxMethod === null) {
        this.options.ajaxMethod = (_ref4 = this.$form.attr("method")) != null ? _ref4.toLowerCase() : void 0;
      }
      switch (this.options.ajaxMethod) {
        case "post":
        case "put":
        case "delete":
          break;
        default:
          this.options.ajaxMethod = "get";
      }
      this.observe("submit", this.options.onSubmit);
      this.observe("success", this.options.onSuccess);
      this.observe("error", this.options.onError);
      this.observe("complete", this.options.onComplete);
      _ref5 = qwery(inputSelector, this.form);
      _fn = function(input) {
        var $input, element, elements, errorsElement, i, label, onchangeFunction, validateElementsFunction, validator, _l, _len3, _ref6, _results;
        $input = bonzo(input);
        if (!$input.fwData("initialized")) {
          $input.fwData("initialized", true);
          if ($input.attr("type") === "hidden") {
            return $input.fwData("forceSubmission", true);
          } else {
            elements = Formwatcher.decorate(_this, input);
            if (elements.input !== input) {
              bonzo(elements.input).attr("class", $input.attr("class"));
              input = elements.input;
              $input = bonzo(elements.input);
            }
            if (!elements.label) {
              label = Formwatcher.getLabel(elements, _this.options.automatchLabel);
              if (label) {
                elements.label = label;
              }
            }
            if (!elements.errors) {
              errorsElement = Formwatcher.getErrorsElement(elements, true);
              elements.errors = errorsElement;
            }
            _this.allElements.push(elements);
            $input.fwData("validators", []);
            _ref6 = _this.validators;
            for (_l = 0, _len3 = _ref6.length; _l < _len3; _l++) {
              validator = _ref6[_l];
              if ((_this.options[_this.name] != null) && _this.options[_this.name] === false) {
                return false;
              }
              if ((!(_this.options[validator.name] != null) || _this.options[validator.name] !== false) && validator.accepts(input, _this)) {
                Formwatcher.debug("Validator '" + validator.name + "' found for input field '" + ($input.attr("name")) + "'.");
                $input.fwData("validators").push(validator);
              }
            }
            Formwatcher.storeInitialValue(elements);
            if ($input.val() === null || !$input.val()) {
              for (i in elements) {
                element = elements[i];
                bonzo(element).addClass("empty");
              }
            }
            if (!_this.options.submitUnchanged) {
              Formwatcher.removeName(elements);
            }
            onchangeFunction = function() {
              return Formwatcher.changed(elements, _this);
            };
            validateElementsFunction = function() {
              return _this.validateElements(elements, true);
            };
            _results = [];
            for (i in elements) {
              element = elements[i];
              _results.push((function(element) {
                var _this = this;
                bean.on(element, "focus", function() {
                  return bonzo(element).addClass("focus");
                });
                bean.on(element, "blur", function() {
                  return bonzo(element).removeClass("focus");
                });
                bean.on(element, "change", onchangeFunction);
                bean.on(element, "blur", onchangeFunction);
                return bean.on(element, "keyup", validateElementsFunction);
              })(element));
            }
            return _results;
          }
        }
      };
      for (_k = 0, _len2 = _ref5.length; _k < _len2; _k++) {
        input = _ref5[_k];
        _fn(input);
      }
      submitButtons = qwery("input[type=submit], button[type=''], button[type='submit'], button:not([type])", this.form);
      hiddenSubmitButtonElement = bonzo.create('<input type="hidden" name="" value="" />')[0];
      this.$form.append(hiddenSubmitButtonElement);
      _fn1 = function(element) {
        var belement;
        belement = bonzo(element);
        return bean.on(element, "click", function(e) {
          var elementValue, tmpElementText, _ref6, _ref7;
          if (element.tagName === "BUTTON") {
            tmpElementText = belement.text();
            belement.text("");
            elementValue = (_ref6 = belement.val()) != null ? _ref6 : "";
            belement.text(tmpElementText);
          } else {
            elementValue = (_ref7 = belement.val()) != null ? _ref7 : "";
          }
          bonzo(hiddenSubmitButtonElement).attr("name", belement.attr("name") || "").val(elementValue);
          _this.submitForm();
          return e.stopPropagation();
        });
      };
      for (_l = 0, _len3 = submitButtons.length; _l < _len3; _l++) {
        element = submitButtons[_l];
        _fn1(element);
      }
    }

    Watcher.prototype.callObservers = function() {
      var args, eventName, observer, _i, _len, _ref, _results;
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.observers[eventName];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        observer = _ref[_i];
        _results.push(observer.apply(this, args));
      }
      return _results;
    };

    Watcher.prototype.observe = function(eventName, func) {
      if (this.observers[eventName] === undefined) {
        this.observers[eventName] = [];
      }
      this.observers[eventName].push(func);
      return this;
    };

    Watcher.prototype.stopObserving = function(eventName, func) {
      var observer;
      this.observers[eventName] = (function() {
        var _i, _len, _ref, _results;
        _ref = this.observers[eventName];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          observer = _ref[_i];
          if (observer !== func) {
            _results.push(observer);
          }
        }
        return _results;
      }).call(this);
      return this;
    };

    Watcher.prototype.enableForm = function() {
      return bonzo(qwery(inputSelector, this.form)).removeAttr("disabled");
    };

    Watcher.prototype.disableForm = function() {
      return bonzo(qwery(inputSelector, this.form)).attr("disabled", "disabled");
    };

    Watcher.prototype.submitForm = function(e) {
      var _this = this;
      if (!this.options.validate || this.validateForm()) {
        this.callObservers("submit");
        this.$form.addClass("submitting");
        if (this.options.ajax) {
          this.disableForm();
          return this.submitAjax();
        } else {
          this.$form.attr("action", this.$form.fwData("originalAction"));
          setTimeout(function() {
            _this.form.submit();
            return _this.disableForm();
          }, 1);
          return false;
        }
      }
    };

    Watcher.prototype.validateForm = function() {
      var elements, validated, _i, _len, _ref;
      validated = true;
      _ref = this.allElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elements = _ref[_i];
        if (!this.validateElements(elements)) {
          validated = false;
        }
      }
      return validated;
    };

    Watcher.prototype.validateElements = function(elements, inlineValidating) {
      var $input, element, formattedValue, i, validated, validationOutput, validator, _i, _j, _len, _len1, _ref, _ref1;
      $input = bonzo(elements.input);
      validated = true;
      if ($input.fwData("validators").length) {
        if (!inlineValidating || !$input.fwData("lastValidatedValue") || $input.fwData("lastValidatedValue") !== $input.val()) {
          $input.fwData("lastValidatedValue", $input.val());
          Formwatcher.debug("Validating input " + $input.attr("name"));
          $input.fwData("validationErrors", []);
          _ref = $input.fwData("validators");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            validator = _ref[_i];
            if ($input.val() === "" && validator.name !== "Required") {
              Formwatcher.debug("Validating " + validator.name + ". Field was empty so continuing.");
              continue;
            }
            Formwatcher.debug("Validating " + validator.name);
            validationOutput = validator.validate($input.val(), elements.input);
            if (validationOutput !== true) {
              validated = false;
              $input.fwData("validationErrors").push(validationOutput);
              break;
            }
          }
          if (validated) {
            bonzo(elements.errors).html("").hide();
            for (i in elements) {
              if (!__hasProp.call(elements, i)) continue;
              element = elements[i];
              bonzo(element).addClass("validated").removeClass("error");
            }
            if (inlineValidating) {
              $input.fwData("forceValidationOnChange", true);
            }
          } else {
            for (i in elements) {
              if (!__hasProp.call(elements, i)) continue;
              element = elements[i];
              bonzo(element).removeClass("validated");
            }
            if (!inlineValidating) {
              bonzo(elements.errors).html($input.fwData("validationErrors").join("<br />")).show();
              for (i in elements) {
                if (!__hasProp.call(elements, i)) continue;
                element = elements[i];
                bonzo(element).addClass("error");
              }
            }
          }
        }
        if (!inlineValidating && validated) {
          formattedValue = $input.fwData("lastValidatedValue");
          _ref1 = $input.fwData("validators");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            validator = _ref1[_j];
            formattedValue = validator.format(formattedValue);
          }
          $input.val(formattedValue);
        }
      } else {
        for (i in elements) {
          if (!__hasProp.call(elements, i)) continue;
          element = elements[i];
          bonzo(element).addClass("validated");
        }
      }
      return validated;
    };

    Watcher.prototype.submitAjax = function() {
      var attributeName, fieldCount, fields, i, input, _i, _len, _ref, _ref1,
        _this = this;
      Formwatcher.debug("Submitting form via AJAX.");
      fields = {};
      fieldCount = 0;
      i = 0;
      _ref = qwery(inputSelector, this.form);
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        input = _ref[i];
        input = bonzo(input);
        if (input[0].nodeName === "BUTTON" || (input[0].nodeName === "INPUT" && (input.attr("type").toLowerCase() === "submit" || input.attr("type").toLowerCase() === "button"))) {
          continue;
        }
        if (input.fwData("forceSubmission") || (input.attr("type") && input.attr("type").toLowerCase() === "checkbox") || input.fwData('changed') || this.options.submitUnchanged) {
          if (input.attr("type") !== "checkbox" || input.get(0).checked) {
            fieldCount++;
            attributeName = (_ref1 = input.attr("name")) != null ? _ref1 : "unnamedInput_" + i;
            fields[attributeName] = input.val();
          }
        }
      }
      if (fieldCount === 0 && !this.options.submitFormIfAllUnchanged) {
        return setTimeout(function() {
          return _this.ajaxSuccess();
        }, 1);
      } else {
        return request(this.options.ajaxMethod, this.$form.fwData("originalAction")).type("form").send(fields).end(function(res) {
          var body, _ref2;
          body = (_ref2 = res.body) != null ? _ref2 : res.text;
          if (res.error) {
            _this.callObservers("error", body);
          } else {
            if (!_this.options.responseCheck(body)) {
              _this.callObservers("error", body);
            } else {
              _this.callObservers("success", body);
              _this.ajaxSuccess();
            }
          }
          _this.$form.removeClass("submitting");
          return _this.callObservers("complete", body);
        });
      }
    };

    Watcher.prototype.ajaxSuccess = function() {
      var element, elements, i, input, isEmpty, _i, _len, _ref, _results;
      this.enableForm();
      _ref = this.allElements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elements = _ref[_i];
        Formwatcher.unsetChanged(elements, this);
        if (this.options.resetFormAfterSubmit) {
          Formwatcher.restoreInitialValue(elements);
        } else {
          Formwatcher.storeInitialValue(elements);
        }
        input = bonzo(elements.input);
        isEmpty = input.val() === null || !input.val();
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (i in elements) {
            element = elements[i];
            element = bonzo(element);
            if (isEmpty) {
              _results1.push(element.addClass("empty"));
            } else {
              _results1.push(element.removeClass("empty"));
            }
          }
          return _results1;
        })());
      }
      return _results;
    };

    return Watcher;

  })();

  module.exports = Watcher;

}).call(this);
