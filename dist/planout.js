(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["planout"] = factory();
	else
		root["planout"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _experiment = __webpack_require__(1);

	var _experiment2 = _interopRequireDefault(_experiment);

	var _interpreter = __webpack_require__(13);

	var _interpreter2 = _interopRequireDefault(_interpreter);

	var _random = __webpack_require__(3);

	var _random2 = _interopRequireDefault(_random);

	var _core = __webpack_require__(15);

	var _core2 = _interopRequireDefault(_core);

	var _namespace = __webpack_require__(16);

	var Namespace = _interopRequireWildcard(_namespace);

	var _assignment = __webpack_require__(2);

	var _assignment2 = _interopRequireDefault(_assignment);

	var _experimentSetup = __webpack_require__(17);

	var _experimentSetup2 = _interopRequireDefault(_experimentSetup);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  Namespace: Namespace,
	  Assignment: _assignment2.default,
	  Interpreter: _interpreter2.default,
	  Experiment: _experiment2.default,
	  ExperimentSetup: _experimentSetup2.default,
	  Ops: {
	    Random: _random2.default,
	    Core: _core2.default
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _assignment = __webpack_require__(2);

	var _assignment2 = _interopRequireDefault(_assignment);

	var _utils = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Experiment = function () {
	  function Experiment(inputs) {
	    _classCallCheck(this, Experiment);

	    this.inputs = inputs;
	    this._exposureLogged = false;
	    this._salt = null;
	    this._inExperiment = true;

	    this.name = this.getDefaultExperimentName();
	    this._autoExposureLog = true;

	    this.setup();

	    this._assignment = new _assignment2.default(this.getSalt());
	    this._assigned = false;
	  }

	  //helper function to return the class name of the current experiment class


	  _createClass(Experiment, [{
	    key: 'getDefaultExperimentName',
	    value: function getDefaultExperimentName() {
	      if ((0, _utils.isObject)(this) && this.constructor && this !== this.window) {
	        var arr = this.constructor.toString().match(/function\s*(\w+)/);
	        if (arr && arr.length === 2) {
	          return arr[1];
	        }
	      }
	      return "GenericExperiment";
	    }

	    /* default implementation of fetching the range of experiment parameters that this experiment can take */

	  }, {
	    key: 'getDefaultParamNames',
	    value: function getDefaultParamNames() {
	      var assignmentFxn = this.assign.toString();
	      var possibleKeys = assignmentFxn.split('.set(');
	      possibleKeys.splice(0, 1); //remove first index since it'll have the function definitions
	      return (0, _utils.map)(possibleKeys, function (val) {
	        var str = (0, _utils.trimTrailingWhitespace)(val.split(',')[0]);
	        return str.substr(1, str.length - 2); //remove string chars
	      });
	    }
	  }, {
	    key: 'requireAssignment',
	    value: function requireAssignment() {
	      if (!this._assigned) {
	        this._assign();
	      }
	    }
	  }, {
	    key: 'requireExposureLogging',
	    value: function requireExposureLogging(paramName) {
	      if (this.shouldLogExposure(paramName)) {
	        this.logExposure();
	      }
	    }
	  }, {
	    key: '_assign',
	    value: function _assign() {
	      this.configureLogger();
	      var assignVal = this.assign(this._assignment, this.inputs);
	      if (assignVal || assignVal === undefined) {
	        this._inExperiment = true;
	      } else {
	        this._inExperiment = false;
	      }
	      this._assigned = true;
	    }
	  }, {
	    key: 'setup',
	    value: function setup() {
	      return;
	    }
	  }, {
	    key: 'inExperiment',
	    value: function inExperiment() {
	      return this._inExperiment;
	    }
	  }, {
	    key: 'addOverride',
	    value: function addOverride(key, value) {
	      this._assignment.addOverride(key, value);
	    }
	  }, {
	    key: 'setOverrides',
	    value: function setOverrides(value) {
	      this._assignment.setOverrides(value);
	      var o = this._assignment.getOverrides();
	      var self = this;
	      (0, _utils.forEach)(Object.keys(o), function (key) {
	        if (self.inputs[key] !== undefined) {
	          self.inputs[key] = o[key];
	        }
	      });
	    }
	  }, {
	    key: 'getSalt',
	    value: function getSalt() {
	      if (this._salt) {
	        return this._salt;
	      } else {
	        return this.name;
	      }
	    }
	  }, {
	    key: 'setSalt',
	    value: function setSalt(value) {
	      this._salt = value;
	      if (this._assignment) {
	        this._assignment.experimentSalt = value;
	      }
	    }
	  }, {
	    key: 'getName',
	    value: function getName() {
	      return this.name;
	    }
	  }, {
	    key: 'assign',
	    value: function assign(params, args) {
	      throw "IMPLEMENT assign";
	    }

	    /*
	    This function should return a list of the possible parameter names that the assignment procedure may assign.
	    You can optionally override this function to always return this.getDefaultParamNames()
	    which will analyze your program at runtime to determine what the range of possible experimental parameters are. 
	    Otherwise, simply return a fixed list of the experimental parameters that your assignment procedure may assign.
	    */

	  }, {
	    key: 'getParamNames',
	    value: function getParamNames() {
	      throw "IMPLEMENT getParamNames";
	    }
	  }, {
	    key: 'shouldFetchExperimentParameter',
	    value: function shouldFetchExperimentParameter(name) {
	      var experimentalParams = this.getParamNames();
	      return experimentalParams.indexOf(name) >= 0;
	    }
	  }, {
	    key: 'setName',
	    value: function setName(value) {
	      var re = /\s+/g;
	      this.name = value.replace(re, '-');
	      if (this._assignment) {
	        this._assignment.experimentSalt = this.getSalt();
	      }
	    }
	  }, {
	    key: '__asBlob',
	    value: function __asBlob() {
	      var extras = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var d = {
	        'name': this.getName(),
	        'time': new Date().getTime() / 1000,
	        'salt': this.getSalt(),
	        'inputs': this.inputs,
	        'params': this._assignment.getParams()
	      };
	      (0, _utils.extend)(d, extras);
	      return d;
	    }
	  }, {
	    key: 'setAutoExposureLogging',
	    value: function setAutoExposureLogging(value) {
	      this._autoExposureLog = value;
	    }
	  }, {
	    key: 'getParams',
	    value: function getParams() {
	      this.requireAssignment();
	      this.requireExposureLogging();
	      return this._assignment.getParams();
	    }
	  }, {
	    key: 'get',
	    value: function get(name, def) {
	      this.requireAssignment();
	      this.requireExposureLogging(name);
	      return this._assignment.get(name, def);
	    }
	  }, {
	    key: 'toString',
	    value: function toString() {
	      this.requireAssignment();
	      this.requireExposureLogging();
	      return JSON.stringify(this.__asBlob());
	    }
	  }, {
	    key: 'logExposure',
	    value: function logExposure(extras) {
	      if (!this.inExperiment()) {
	        return;
	      }
	      this._exposureLogged = true;
	      this.logEvent('exposure', extras);
	    }
	  }, {
	    key: 'shouldLogExposure',
	    value: function shouldLogExposure(paramName) {
	      if (paramName !== undefined && !this.shouldFetchExperimentParameter(paramName)) {
	        return false;
	      }
	      return this._autoExposureLog && !this.previouslyLogged();
	    }
	  }, {
	    key: 'logEvent',
	    value: function logEvent(eventType, extras) {
	      if (!this.inExperiment()) {
	        return;
	      }

	      var extraPayload;

	      if (extras) {
	        extraPayload = { 'event': eventType, 'extra_data': (0, _utils.shallowCopy)(extras) };
	      } else {
	        extraPayload = { 'event': eventType };
	      }

	      this.log(this.__asBlob(extraPayload));
	    }
	  }, {
	    key: 'configureLogger',
	    value: function configureLogger() {
	      throw "IMPLEMENT configureLogger";
	    }
	  }, {
	    key: 'log',
	    value: function log(data) {
	      throw "IMPLEMENT log";
	    }
	  }, {
	    key: 'previouslyLogged',
	    value: function previouslyLogged() {
	      throw "IMPLEMENT previouslyLogged";
	    }
	  }]);

	  return Experiment;
	}();

	exports.default = Experiment;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _random = __webpack_require__(3);

	var _utils = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Assignment = function () {
	  function Assignment(experimentSalt, overrides) {
	    _classCallCheck(this, Assignment);

	    if (!overrides) {
	      overrides = {};
	    }
	    this.experimentSalt = experimentSalt;
	    this._overrides = (0, _utils.shallowCopy)(overrides);
	    this._data = (0, _utils.shallowCopy)(overrides);
	    this.saltSeparator = '.';
	  }

	  _createClass(Assignment, [{
	    key: "evaluate",
	    value: function evaluate(value) {
	      return value;
	    }
	  }, {
	    key: "getOverrides",
	    value: function getOverrides() {
	      return this._overrides;
	    }
	  }, {
	    key: "addOverride",
	    value: function addOverride(key, value) {
	      this._overrides[key] = value;
	      this._data[key] = value;
	    }
	  }, {
	    key: "setOverrides",
	    value: function setOverrides(overrides) {
	      this._overrides = (0, _utils.shallowCopy)(overrides);
	      var self = this;
	      (0, _utils.forEach)(Object.keys(this._overrides), function (overrideKey) {
	        self._data[overrideKey] = self._overrides[overrideKey];
	      });
	    }
	  }, {
	    key: "set",
	    value: function set(name, value) {
	      if (name === '_data') {
	        this._data = value;
	        return;
	      } else if (name === '_overrides') {
	        this._overrides = value;
	        return;
	      } else if (name === 'experimentSalt') {
	        this.experimentSalt = value;
	        return;
	      } else if (name === 'saltSeparator') {
	        this.saltSeparator = value;
	        return;
	      }

	      if ((0, _utils.hasKey)(this._overrides, name)) {
	        return;
	      }
	      if (value instanceof _random.PlanOutOpRandom) {
	        if (!value.args.salt) {
	          value.args.salt = name;
	        }
	        this._data[name] = value.execute(this);
	      } else {
	        this._data[name] = value;
	      }
	    }
	  }, {
	    key: "get",
	    value: function get(name) {
	      if (name === '_data') {
	        return this._data;
	      } else if (name === '_overrides') {
	        return this._overrides;
	      } else if (name === 'experimentSalt') {
	        return this.experimentSalt;
	      } else if (name === 'saltSeparator') {
	        return this.saltSeparator;
	      } else {
	        return this._data[name];
	      }
	    }
	  }, {
	    key: "getParams",
	    value: function getParams() {
	      return this._data;
	    }
	  }, {
	    key: "del",
	    value: function del(name) {
	      delete this._data[name];
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      return String(this._data);
	    }
	  }, {
	    key: "length",
	    value: function length() {
	      return Object.keys(this._data).length;
	    }
	  }]);

	  return Assignment;
	}();

	;

	exports.default = Assignment;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(4);

	var _sha = __webpack_require__(6);

	var _sha2 = _interopRequireDefault(_sha);

	var _utils = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var PlanOutOpRandom = function (_PlanOutOpSimple) {
	  _inherits(PlanOutOpRandom, _PlanOutOpSimple);

	  function PlanOutOpRandom(args) {
	    _classCallCheck(this, PlanOutOpRandom);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlanOutOpRandom).call(this, args));

	    _this.LONG_SCALE = 0xFFFFFFFFFFFFF;
	    return _this;
	  }

	  _createClass(PlanOutOpRandom, [{
	    key: "compatHashCalculation",
	    value: function compatHashCalculation(hash) {
	      return parseInt(hash.substr(0, 13), 16);
	    }
	  }, {
	    key: "compatZeroToOneCalculation",
	    value: function compatZeroToOneCalculation(appendedUnit) {
	      return this.getHash(appendedUnit) / this.LONG_SCALE;
	    }
	  }, {
	    key: "getUnit",
	    value: function getUnit(appendedUnit) {
	      var unit = this.getArgMixed('unit');
	      if (!(0, _utils.isArray)(unit)) {
	        unit = [unit];
	      }
	      if (appendedUnit) {
	        unit.push(appendedUnit);
	      }
	      return unit;
	    }
	  }, {
	    key: "getUniform",
	    value: function getUniform() {
	      var minVal = arguments.length <= 0 || arguments[0] === undefined ? 0.0 : arguments[0];
	      var maxVal = arguments.length <= 1 || arguments[1] === undefined ? 1.0 : arguments[1];
	      var appendedUnit = arguments[2];

	      var zeroToOne = this.compatZeroToOneCalculation(appendedUnit);
	      return zeroToOne * (maxVal - minVal) + minVal;
	    }
	  }, {
	    key: "getHash",
	    value: function getHash(appendedUnit) {
	      var fullSalt;
	      if (this.args.full_salt) {
	        fullSalt = this.getArgString('full_salt') + '.';
	      } else {
	        var salt = this.getArgString('salt');
	        fullSalt = this.mapper.get('experimentSalt') + '.' + salt + this.mapper.get('saltSeparator');
	      }

	      var unitStr = this.getUnit(appendedUnit).map(function (element) {
	        return String(element);
	      }).join('.');
	      var hashStr = fullSalt + unitStr;
	      var hash = (0, _sha2.default)(hashStr);
	      return this.compatHashCalculation(hash);
	    }
	  }]);

	  return PlanOutOpRandom;
	}(_base.PlanOutOpSimple);

	var RandomFloat = function (_PlanOutOpRandom) {
	  _inherits(RandomFloat, _PlanOutOpRandom);

	  function RandomFloat() {
	    _classCallCheck(this, RandomFloat);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(RandomFloat).apply(this, arguments));
	  }

	  _createClass(RandomFloat, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var minVal = this.getArgNumber('min');
	      var maxVal = this.getArgNumber('max');
	      return this.getUniform(minVal, maxVal);
	    }
	  }]);

	  return RandomFloat;
	}(PlanOutOpRandom);

	var RandomInteger = function (_PlanOutOpRandom2) {
	  _inherits(RandomInteger, _PlanOutOpRandom2);

	  function RandomInteger() {
	    _classCallCheck(this, RandomInteger);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(RandomInteger).apply(this, arguments));
	  }

	  _createClass(RandomInteger, [{
	    key: "compatRandomIntegerCalculation",
	    value: function compatRandomIntegerCalculation(minVal, maxVal) {
	      return (this.getHash() + minVal) % (maxVal - minVal + 1);
	    }
	  }, {
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var minVal = this.getArgNumber('min');
	      var maxVal = this.getArgNumber('max');
	      return this.compatRandomIntegerCalculation(minVal, maxVal);
	    }
	  }]);

	  return RandomInteger;
	}(PlanOutOpRandom);

	var BernoulliTrial = function (_PlanOutOpRandom3) {
	  _inherits(BernoulliTrial, _PlanOutOpRandom3);

	  function BernoulliTrial() {
	    _classCallCheck(this, BernoulliTrial);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BernoulliTrial).apply(this, arguments));
	  }

	  _createClass(BernoulliTrial, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var p = this.getArgNumber('p');
	      if (p < 0 || p > 1) {
	        throw "Invalid probability";
	      }

	      if (this.getUniform(0.0, 1.0) <= p) {
	        return 1;
	      } else {
	        return 0;
	      }
	    }
	  }]);

	  return BernoulliTrial;
	}(PlanOutOpRandom);

	var BernoulliFilter = function (_PlanOutOpRandom4) {
	  _inherits(BernoulliFilter, _PlanOutOpRandom4);

	  function BernoulliFilter() {
	    _classCallCheck(this, BernoulliFilter);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BernoulliFilter).apply(this, arguments));
	  }

	  _createClass(BernoulliFilter, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var p = this.getArgNumber('p');
	      var values = this.getArgList('choices');
	      if (p < 0 || p > 1) {
	        throw "Invalid probability";
	      }
	      if (values.length == 0) {
	        return [];
	      }
	      var ret = [];
	      for (var i = 0; i < values.length; i++) {
	        var cur = values[i];
	        if (this.getUniform(0.0, 1.0, cur) <= p) {
	          ret.push(cur);
	        }
	      }
	      return ret;
	    }
	  }]);

	  return BernoulliFilter;
	}(PlanOutOpRandom);

	var UniformChoice = function (_PlanOutOpRandom5) {
	  _inherits(UniformChoice, _PlanOutOpRandom5);

	  function UniformChoice() {
	    _classCallCheck(this, UniformChoice);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(UniformChoice).apply(this, arguments));
	  }

	  _createClass(UniformChoice, [{
	    key: "compatRandomIndexCalculation",
	    value: function compatRandomIndexCalculation(choices) {
	      return this.getHash() % choices.length;
	    }
	  }, {
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var choices = this.getArgList('choices');
	      if (choices.length === 0) {
	        return [];
	      }
	      var randIndex = this.compatRandomIndexCalculation(choices);
	      return choices[randIndex];
	    }
	  }]);

	  return UniformChoice;
	}(PlanOutOpRandom);

	var WeightedChoice = function (_PlanOutOpRandom6) {
	  _inherits(WeightedChoice, _PlanOutOpRandom6);

	  function WeightedChoice() {
	    _classCallCheck(this, WeightedChoice);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(WeightedChoice).apply(this, arguments));
	  }

	  _createClass(WeightedChoice, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var choices = this.getArgList('choices');
	      var weights = this.getArgList('weights');
	      if (choices.length === 0) {
	        return [];
	      }
	      var cumSum = 0;
	      var cumWeights = weights.map(function (weight) {
	        cumSum += weight;
	        return cumSum;
	      });
	      var stopVal = this.getUniform(0.0, cumSum);
	      return (0, _utils.reduce)(cumWeights, function (retVal, curVal, i) {
	        if (retVal) {
	          return retVal;
	        }
	        if (stopVal <= curVal) {
	          return choices[i];
	        }
	        return retVal;
	      }, null);
	    }
	  }]);

	  return WeightedChoice;
	}(PlanOutOpRandom);

	var Sample = function (_PlanOutOpRandom7) {
	  _inherits(Sample, _PlanOutOpRandom7);

	  function Sample() {
	    _classCallCheck(this, Sample);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Sample).apply(this, arguments));
	  }

	  _createClass(Sample, [{
	    key: "compatSampleIndexCalculation",
	    value: function compatSampleIndexCalculation(i) {
	      return this.getHash(i) % (i + 1);
	    }
	  }, {
	    key: "compatAllowSampleStoppingPoint",
	    value: function compatAllowSampleStoppingPoint() {
	      return true;
	    }
	  }, {
	    key: "sample",
	    value: function sample(array, numDraws) {
	      var len = array.length;
	      var stoppingPoint = len - numDraws;
	      var allowStoppingPoint = this.compatAllowSampleStoppingPoint();

	      for (var i = len - 1; i > 0; i--) {
	        var j = this.compatSampleIndexCalculation(i);

	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;

	        if (allowStoppingPoint && stoppingPoint === i) {
	          return array.slice(i, len);
	        }
	      }
	      return array.slice(0, numDraws);
	    }
	  }, {
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var choices = (0, _utils.shallowCopy)(this.getArgList('choices'));
	      var numDraws = 0;
	      if (this.args.draws !== undefined) {
	        numDraws = this.getArgNumber('draws');
	      } else {
	        numDraws = choices.length;
	      }
	      return this.sample(choices, numDraws);
	    }
	  }]);

	  return Sample;
	}(PlanOutOpRandom);

	exports.default = { PlanOutOpRandom: PlanOutOpRandom, Sample: Sample, WeightedChoice: WeightedChoice, UniformChoice: UniformChoice, BernoulliFilter: BernoulliFilter, BernoulliTrial: BernoulliTrial, RandomInteger: RandomInteger, RandomFloat: RandomFloat };
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PlanOutOpUnary = exports.PlanOutOpBinary = exports.PlanOutOpCommutative = exports.PlanOutOpSimple = exports.PlanOutOp = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(5);

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PlanOutOp = function () {
	  function PlanOutOp(args) {
	    _classCallCheck(this, PlanOutOp);

	    this.args = args;
	  }

	  _createClass(PlanOutOp, [{
	    key: "execute",
	    value: function execute(mapper) {
	      throw "Implement the execute function";
	    }
	  }, {
	    key: "dumpArgs",
	    value: function dumpArgs() {
	      console.log(this.args);
	    }
	  }, {
	    key: "getArgMixed",
	    value: function getArgMixed(name) {
	      if (this.args[name] === undefined) {
	        throw "Missing argument " + name;
	      }
	      return this.args[name];
	    }
	  }, {
	    key: "getArgNumber",
	    value: function getArgNumber(name) {
	      var cur = this.getArgMixed(name);
	      if (typeof cur !== "number") {
	        throw name + " is not a number.";
	      }
	      return cur;
	    }
	  }, {
	    key: "getArgString",
	    value: function getArgString(name) {
	      var cur = this.getArgMixed(name);
	      if (typeof cur !== "string") {
	        throw name + " is not a string.";
	      }
	      return cur;
	    }
	  }, {
	    key: "getArgList",
	    value: function getArgList(name) {
	      var cur = this.getArgMixed(name);
	      if (Object.prototype.toString.call(cur) !== '[object Array]') {
	        throw name + " is not a list";
	      }
	      return cur;
	    }
	  }, {
	    key: "getArgObject",
	    value: function getArgObject(name) {
	      var cur = this.getArgMixed(name);
	      if (Object.prototype.toString.call(cur) !== '[object Object]') {
	        throw name + " is not an object.";
	      }
	      return cur;
	    }
	  }, {
	    key: "getArgIndexish",
	    value: function getArgIndexish(name) {
	      var cur = this.getArgMixed(name);
	      var type = Object.prototype.toString.call(cur);
	      if (type !== '[object Object]' && type !== '[object Array]') {
	        throw name + " is not an list or object.";
	      }
	      return cur;
	    }
	  }]);

	  return PlanOutOp;
	}();

	;

	var PlanOutOpSimple = function (_PlanOutOp) {
	  _inherits(PlanOutOpSimple, _PlanOutOp);

	  function PlanOutOpSimple() {
	    _classCallCheck(this, PlanOutOpSimple);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlanOutOpSimple).apply(this, arguments));
	  }

	  _createClass(PlanOutOpSimple, [{
	    key: "execute",
	    value: function execute(mapper) {
	      this.mapper = mapper;
	      var self = this;
	      (0, _utils.forEach)(Object.keys(this.args), function (key) {
	        self.args[key] = mapper.evaluate(self.args[key]);
	      });
	      return this.simpleExecute();
	    }
	  }]);

	  return PlanOutOpSimple;
	}(PlanOutOp);

	var PlanOutOpUnary = function (_PlanOutOpSimple) {
	  _inherits(PlanOutOpUnary, _PlanOutOpSimple);

	  function PlanOutOpUnary() {
	    _classCallCheck(this, PlanOutOpUnary);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlanOutOpUnary).apply(this, arguments));
	  }

	  _createClass(PlanOutOpUnary, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      return this.unaryExecute(this.getArgMixed('value'));
	    }
	  }, {
	    key: "getUnaryString",
	    value: function getUnaryString() {
	      return this.args.op;
	    }
	  }, {
	    key: "unaryExecute",
	    value: function unaryExecute(value) {
	      throw "implement unaryExecute";
	    }
	  }]);

	  return PlanOutOpUnary;
	}(PlanOutOpSimple);

	var PlanOutOpBinary = function (_PlanOutOpSimple2) {
	  _inherits(PlanOutOpBinary, _PlanOutOpSimple2);

	  function PlanOutOpBinary() {
	    _classCallCheck(this, PlanOutOpBinary);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlanOutOpBinary).apply(this, arguments));
	  }

	  _createClass(PlanOutOpBinary, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var left = this.getArgMixed('left');
	      var right = this.getArgMixed('right');
	      return this.binaryExecute(left, right);
	    }
	  }, {
	    key: "getInfixString",
	    value: function getInfixString() {
	      return this.args.op;
	    }
	  }, {
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      throw "implement binaryExecute";
	    }
	  }]);

	  return PlanOutOpBinary;
	}(PlanOutOpSimple);

	var PlanOutOpCommutative = function (_PlanOutOpSimple3) {
	  _inherits(PlanOutOpCommutative, _PlanOutOpSimple3);

	  function PlanOutOpCommutative() {
	    _classCallCheck(this, PlanOutOpCommutative);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlanOutOpCommutative).apply(this, arguments));
	  }

	  _createClass(PlanOutOpCommutative, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      return this.commutativeExecute(this.getArgList('values'));
	    }
	  }, {
	    key: "getCommutativeString",
	    value: function getCommutativeString() {
	      return this.args.op;
	    }
	  }, {
	    key: "commutativeExecute",
	    value: function commutativeExecute(values) {
	      throw "implement commutativeExecute";
	    }
	  }]);

	  return PlanOutOpCommutative;
	}(PlanOutOpSimple);

	exports.PlanOutOp = PlanOutOp;
	exports.PlanOutOpSimple = PlanOutOpSimple;
	exports.PlanOutOpCommutative = PlanOutOpCommutative;
	exports.PlanOutOpBinary = PlanOutOpBinary;
	exports.PlanOutOpUnary = PlanOutOpUnary;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*  Most of these functions are from the wonderful Underscore package http://underscorejs.org/  
	    This file exists so that the planoutjs library doesn't depend on a few unneeded third party dependencies
	    so that consumers of the library don't have to include dependencies such as underscore. As well, this helps reduce
	    the file size of the resulting library.
	*/

	var trimTrailingWhitespace = function trimTrailingWhitespace(str) {
	  return str.replace(/^\s+|\s+$/g, '');
	};

	var getParameterByName = function getParameterByName(name) {
	  var hasLocation = typeof location !== 'undefined';
	  var hasWindow = typeof window !== 'undefined';
	  var queryParamVal;

	  if (hasLocation) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    queryParamVal = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	  } else {
	    queryParamVal = "";
	  }

	  if (queryParamVal === null || queryParamVal === undefined || queryParamVal.length === 0) {
	    if (hasWindow && window.localStorage !== undefined && window.localStorage !== null) {
	      return window.localStorage.getItem(name);
	    }
	  }
	  return queryParamVal;
	};

	var deepCopy = function deepCopy(obj) {
	  var newObj = obj;
	  if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
	    newObj = Object.prototype.toString.call(obj) === "[object Array]" ? [] : {};
	    for (var i in obj) {
	      newObj[i] = deepCopy(obj[i]);
	    }
	  }
	  return newObj;
	};

	var isObject = function isObject(obj) {
	  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	  return type === 'function' || type === 'object' && !!obj;
	};

	var isArray = function isArray(object) {
	  if (Array.isArray) {
	    return Array.isArray(object);
	  } else {
	    return Object.prototype.toString.call(planout_code) === '[object Array]';
	  }
	};

	var isFunction = function isFunction(obj) {
	  return typeof obj == 'function' || false;
	};

	//extend helpers

	var keys = function keys(obj) {
	  if (!isObject(obj)) return [];
	  if (Object.keys) return Object.keys(obj);
	  var keys = [];
	  for (var key in obj) {
	    if (has(obj, key)) keys.push(key);
	  }if (hasEnumBug) collectNonEnumProps(obj, keys);

	  return keys;
	};

	var allKeys = function allKeys(obj) {
	  if (!isObject(obj)) return [];
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }if (hasEnumBug) collectNonEnumProps(obj, keys);

	  return keys;
	};

	var extendHolder = function extendHolder(keysFunc, undefinedOnly) {
	  return function (obj) {
	    var length = arguments.length;
	    if (length < 2 || obj == null) return obj;
	    for (var index = 1; index < length; index++) {
	      var source = arguments[index],
	          keys = keysFunc(source),
	          l = keys.length;
	      for (var i = 0; i < l; i++) {
	        var key = keys[i];
	        if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	      }
	    }
	    return obj;
	  };
	};

	//extend functionality from underscore
	var extend = extendHolder(allKeys);
	var extendOwn = extendHolder(keys);

	/* underscore helpers */
	var identity = function identity(value) {
	  return value;
	};

	var isMatch = function isMatch(object, attrs) {
	  var keys = keys(attrs),
	      length = keys.length;
	  if (object == null) return !length;
	  var obj = Object(object);
	  for (var i = 0; i < length; i++) {
	    var key = keys[i];
	    if (attrs[key] !== obj[key] || !(key in obj)) return false;
	  }
	  return true;
	};

	var matcher = function matcher(attrs) {
	  attrs = extendOwn({}, attrs);
	  return function (obj) {
	    return isMatch(obj, attrs);
	  };
	};

	var cb = function cb(value, context, argCount) {
	  if (value == null) return identity;
	  if (isFunction(value)) return optimizeCb(value, context, argCount);
	  if (isObject(value)) return matcher(value);
	  return property(value);
	};

	var optimizeCb = function optimizeCb(func, context, argCount) {
	  if (context === void 0) return func;
	  switch (argCount == null ? 3 : argCount) {
	    case 1:
	      return function (value) {
	        return func.call(context, value);
	      };
	    case 2:
	      return function (value, other) {
	        return func.call(context, value, other);
	      };
	    case 3:
	      return function (value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	    case 4:
	      return function (accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	  }
	  return function () {
	    return func.apply(context, arguments);
	  };
	};

	//from underscore
	var forEach = function forEach(obj, iteratee, context) {
	  iteratee = optimizeCb(iteratee, context);
	  var i, length;
	  if (isArrayLike(obj)) {
	    for (i = 0, length = obj.length; i < length; i++) {
	      iteratee(obj[i], i, obj);
	    }
	  } else {
	    var theKeys = keys(obj);
	    for (i = 0, length = theKeys.length; i < length; i++) {
	      iteratee(obj[theKeys[i]], theKeys[i], obj);
	    }
	  }
	  return obj;
	};

	//map functionality from underscore
	var map = function map(obj, iteratee, context) {
	  iteratee = cb(iteratee, context);
	  var theKeys = !isArrayLike(obj) && keys(obj),
	      length = (theKeys || obj).length,
	      results = Array(length);
	  for (var index = 0; index < length; index++) {
	    var currentKey = theKeys ? theKeys[index] : index;
	    results[index] = iteratee(obj[currentKey], currentKey, obj);
	  }
	  return results;
	};

	//reduce functionality from underscore
	var reduce = function reduce(obj, iteratee, memo, context) {
	  iteratee = optimizeCb(iteratee, context, 4);
	  var theKeys = !isArrayLike(obj) && keys(obj),
	      length = (theKeys || obj).length,
	      index = 0;

	  if (arguments.length < 3) {
	    memo = obj[theKeys ? theKeys[index] : index];
	    index += 1;
	  }
	  for (; index >= 0 && index < length; index++) {
	    var currentKey = theKeys ? theKeys[index] : index;
	    memo = iteratee(memo, obj[currentKey], currentKey, obj);
	  }
	  return memo;
	};

	//clone functionality from underscore
	var shallowCopy = function shallowCopy(obj) {
	  if (!isObject(obj)) return obj;
	  return isArray(obj) ? obj.slice() : extend({}, obj);
	};

	/* helper functions from underscore */
	var property = function property(key) {
	  return function (obj) {
	    return obj == null ? void 0 : obj[key];
	  };
	};

	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	var getLength = property('length');
	var isArrayLike = function isArrayLike(collection) {
	  var length = getLength(collection);
	  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};

	var has = function has(obj, key) {
	  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
	};

	/* All these are helper functions to deal with older versions of IE  :(*/
	var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
	var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	function collectNonEnumProps(obj, keys) {
	  var nonEnumIdx = nonEnumerableProps.length;
	  var constructor = obj.constructor;
	  var proto = isFunction(constructor) && constructor.prototype || Object.Prototype;

	  var prop = 'constructor';
	  if (has(obj, prop) && !contains(keys, prop)) keys.push(prop);

	  while (nonEnumIdx--) {
	    prop = nonEnumerableProps[nonEnumIdx];
	    if (prop in obj && obj[prop] !== proto[prop] && !contains(keys, prop)) {
	      keys.push(prop);
	    }
	  }
	}
	var contains = function contains(obj, item, fromIndex, guard) {
	  if (!isArrayLike(obj)) obj = values(obj);
	  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	  return obj.indexOf(item) >= 0;
	};

	var range = function range(max) {
	  var l = [];
	  for (var i = 0; i < max; i++) {
	    l.push(i);
	  }
	  return l;
	};

	var hasKey = function hasKey(obj, key) {
	  return typeof obj[key] !== 'undefined';
	};

	exports.default = { deepCopy: deepCopy, map: map, reduce: reduce, getParameterByName: getParameterByName, forEach: forEach, isFunction: isFunction, trimTrailingWhitespace: trimTrailingWhitespace, hasKey: hasKey, shallowCopy: shallowCopy, extend: extend, isObject: isObject, isArray: isArray, range: range };
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {(function() {
	  var crypt = __webpack_require__(11),
	      utf8 = __webpack_require__(12).utf8,
	      bin = __webpack_require__(12).bin,

	  // The core
	  sha1 = function (message) {
	    // Convert to byte array
	    if (message.constructor == String)
	      message = utf8.stringToBytes(message);
	    else if (typeof Buffer !== 'undefined' && typeof Buffer.isBuffer == 'function' && Buffer.isBuffer(message))
	      message = Array.prototype.slice.call(message, 0);
	    else if (!Array.isArray(message))
	      message = message.toString();

	    // otherwise assume byte array

	    var m  = crypt.bytesToWords(message),
	        l  = message.length * 8,
	        w  = [],
	        H0 =  1732584193,
	        H1 = -271733879,
	        H2 = -1732584194,
	        H3 =  271733878,
	        H4 = -1009589776;

	    // Padding
	    m[l >> 5] |= 0x80 << (24 - l % 32);
	    m[((l + 64 >>> 9) << 4) + 15] = l;

	    for (var i = 0; i < m.length; i += 16) {
	      var a = H0,
	          b = H1,
	          c = H2,
	          d = H3,
	          e = H4;

	      for (var j = 0; j < 80; j++) {

	        if (j < 16)
	          w[j] = m[i + j];
	        else {
	          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
	          w[j] = (n << 1) | (n >>> 31);
	        }

	        var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
	                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
	                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
	                j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
	                         (H1 ^ H2 ^ H3) - 899497514);

	        H4 = H3;
	        H3 = H2;
	        H2 = (H1 << 30) | (H1 >>> 2);
	        H1 = H0;
	        H0 = t;
	      }

	      H0 += a;
	      H1 += b;
	      H2 += c;
	      H3 += d;
	      H4 += e;
	    }

	    return [H0, H1, H2, H3, H4];
	  },

	  // Public API
	  api = function (message, options) {
	    var digestbytes = crypt.wordsToBytes(sha1(message));
	    return options && options.asBytes ? digestbytes :
	        options && options.asString ? bin.bytesToString(digestbytes) :
	        crypt.bytesToHex(digestbytes);
	  };

	  api._blocksize = 16;
	  api._digestsize = 20;

	  module.exports = api;
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).Buffer))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(8)
	var ieee754 = __webpack_require__(9)
	var isArray = __webpack_require__(10)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).Buffer, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 9 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	(function() {
	  var base64map
	      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	  crypt = {
	    // Bit-wise rotation left
	    rotl: function(n, b) {
	      return (n << b) | (n >>> (32 - b));
	    },

	    // Bit-wise rotation right
	    rotr: function(n, b) {
	      return (n << (32 - b)) | (n >>> b);
	    },

	    // Swap big-endian to little-endian and vice versa
	    endian: function(n) {
	      // If number given, swap endian
	      if (n.constructor == Number) {
	        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
	      }

	      // Else, assume array and swap all items
	      for (var i = 0; i < n.length; i++)
	        n[i] = crypt.endian(n[i]);
	      return n;
	    },

	    // Generate an array of any length of random bytes
	    randomBytes: function(n) {
	      for (var bytes = []; n > 0; n--)
	        bytes.push(Math.floor(Math.random() * 256));
	      return bytes;
	    },

	    // Convert a byte array to big-endian 32-bit words
	    bytesToWords: function(bytes) {
	      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
	        words[b >>> 5] |= bytes[i] << (24 - b % 32);
	      return words;
	    },

	    // Convert big-endian 32-bit words to a byte array
	    wordsToBytes: function(words) {
	      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
	        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a hex string
	    bytesToHex: function(bytes) {
	      for (var hex = [], i = 0; i < bytes.length; i++) {
	        hex.push((bytes[i] >>> 4).toString(16));
	        hex.push((bytes[i] & 0xF).toString(16));
	      }
	      return hex.join('');
	    },

	    // Convert a hex string to a byte array
	    hexToBytes: function(hex) {
	      for (var bytes = [], c = 0; c < hex.length; c += 2)
	        bytes.push(parseInt(hex.substr(c, 2), 16));
	      return bytes;
	    },

	    // Convert a byte array to a base-64 string
	    bytesToBase64: function(bytes) {
	      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
	        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
	        for (var j = 0; j < 4; j++)
	          if (i * 8 + j * 6 <= bytes.length * 8)
	            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
	          else
	            base64.push('=');
	      }
	      return base64.join('');
	    },

	    // Convert a base-64 string to a byte array
	    base64ToBytes: function(base64) {
	      // Remove non-base-64 characters
	      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

	      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
	          imod4 = ++i % 4) {
	        if (imod4 == 0) continue;
	        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
	            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
	            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
	      }
	      return bytes;
	    }
	  };

	  module.exports = crypt;
	})();


/***/ },
/* 12 */
/***/ function(module, exports) {

	var charenc = {
	  // UTF-8 encoding
	  utf8: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
	    }
	  },

	  // Binary encoding
	  bin: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      for (var bytes = [], i = 0; i < str.length; i++)
	        bytes.push(str.charCodeAt(i) & 0xFF);
	      return bytes;
	    },

	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      for (var str = [], i = 0; i < bytes.length; i++)
	        str.push(String.fromCharCode(bytes[i]));
	      return str.join('');
	    }
	  }
	};

	module.exports = charenc;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _assignment = __webpack_require__(2);

	var _assignment2 = _interopRequireDefault(_assignment);

	var _utils = __webpack_require__(14);

	var _utils2 = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Interpreter = function () {
	  function Interpreter(serialization) {
	    var experimentSalt = arguments.length <= 1 || arguments[1] === undefined ? 'global_salt' : arguments[1];
	    var inputs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	    var environment = arguments[3];

	    _classCallCheck(this, Interpreter);

	    this._serialization = serialization;
	    if (!environment) {
	      this._env = new _assignment2.default(experimentSalt);
	    } else {
	      this._env = environment;
	    }
	    this.experimentSalt = this._experimentSalt = experimentSalt;
	    this._evaluated = false;
	    this._inExperiment = false;
	    this._inputs = (0, _utils2.shallowCopy)(inputs);
	  }

	  _createClass(Interpreter, [{
	    key: 'inExperiment',
	    value: function inExperiment() {
	      return this._inExperiment;
	    }
	  }, {
	    key: 'setEnv',
	    value: function setEnv(newEnv) {
	      this._env = (0, _utils2.deepCopy)(newEnv);
	      return this;
	    }
	  }, {
	    key: 'has',
	    value: function has(name) {
	      return this._env[name];
	    }
	  }, {
	    key: 'get',
	    value: function get(name, defaultVal) {
	      var inputVal = this._inputs[name];
	      if (inputVal === null || inputVal === undefined) {
	        inputVal = defaultVal;
	      }
	      var envVal = this._env.get(name);
	      if (envVal !== undefined && envVal !== null) {
	        return envVal;
	      }
	      return inputVal;
	    }
	  }, {
	    key: 'getParams',
	    value: function getParams() {
	      if (!this._evaluated) {
	        try {
	          this.evaluate(this._serialization);
	        } catch (err) {
	          if (err instanceof _utils.StopPlanOutException) {
	            this._inExperiment = err.inExperiment;
	          }
	        }
	        this._evaluated = true;
	      }
	      return this._env.getParams();
	    }
	  }, {
	    key: 'set',
	    value: function set(name, value) {
	      this._env.set(name, value);
	      return this;
	    }
	  }, {
	    key: 'getSaltSeparator',
	    value: function getSaltSeparator() {
	      return this._env.saltSeparator;
	    }
	  }, {
	    key: 'setOverrides',
	    value: function setOverrides(overrides) {
	      this._env.setOverrides(overrides);
	      return this;
	    }
	  }, {
	    key: 'getOverrides',
	    value: function getOverrides() {
	      return this._env.getOverrides();
	    }
	  }, {
	    key: 'hasOverride',
	    value: function hasOverride(name) {
	      var overrides = this.getOverrides();
	      return overrides && overrides[name] !== undefined;
	    }
	  }, {
	    key: 'registerCustomOperators',
	    value: function registerCustomOperators(operators) {
	      (0, _utils.registerOperators)(operators);
	    }
	  }, {
	    key: 'evaluate',
	    value: function evaluate(planoutCode) {
	      if ((0, _utils2.isObject)(planoutCode) && planoutCode.op) {
	        return (0, _utils.operatorInstance)(planoutCode).execute(this);
	      } else if ((0, _utils2.isArray)(planoutCode)) {
	        var self = this;
	        return (0, _utils2.map)(planoutCode, function (obj) {
	          return self.evaluate(obj);
	        });
	      } else {
	        return planoutCode;
	      }
	    }
	  }]);

	  return Interpreter;
	}();

	exports.default = Interpreter;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.registerOperators = exports.StopPlanOutException = exports.operatorInstance = exports.isOperator = exports.initFactory = exports.operators = undefined;

	var _core = __webpack_require__(15);

	var core = _interopRequireWildcard(_core);

	var _random = __webpack_require__(3);

	var random = _interopRequireWildcard(_random);

	var _utils = __webpack_require__(5);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var initFactory = function initFactory() {
	  return {
	    'literal': core.Literal,
	    'get': core.Get,
	    'set': core.Set,
	    'seq': core.Seq,
	    'return': core.Return,
	    'index': core.Index,
	    'array': core.Arr,
	    'equals': core.Equals,
	    'and': core.And,
	    'or': core.Or,
	    ">": core.GreaterThan,
	    "<": core.LessThan,
	    ">=": core.GreaterThanOrEqualTo,
	    "<=": core.LessThanOrEqualTo,
	    "%": core.Mod,
	    "/": core.Divide,
	    "not": core.Not,
	    "round": core.Round,
	    "negative": core.Negative,
	    "min": core.Min,
	    "max": core.Max,
	    "length": core.Length,
	    "coalesce": core.Coalesce,
	    "map": core.Map,
	    "cond": core.Cond,
	    "product": core.Product,
	    "sum": core.Sum,
	    "randomFloat": random.RandomFloat,
	    "randomInteger": random.RandomInteger,
	    "bernoulliTrial": random.BernoulliTrial,
	    "bernoulliFilter": random.BernoulliFilter,
	    "uniformChoice": random.UniformChoice,
	    "weightedChoice": random.WeightedChoice,
	    "sample": random.Sample
	  };
	};

	var operators = initFactory();

	var isOperator = function isOperator(op) {
	  return (0, _utils.isObject)(op) && op.op;
	};

	var operatorInstance = function operatorInstance(params) {
	  var op = params.op;
	  if (!operators[op]) {
	    throw 'Unknown Operator ' + op;
	  }

	  return new operators[op](params);
	};

	var registerOperators = function registerOperators(ops) {
	  (0, _utils.forEach)(ops, function (value, op) {
	    if (operators[op]) {
	      throw op + ' already is defined';
	    } else {
	      operators[op] = value;
	    }
	  });
	};

	var StopPlanOutException = function StopPlanOutException(inExperiment) {
	  _classCallCheck(this, StopPlanOutException);

	  this.inExperiment = inExperiment;
	};

	exports.operators = operators;
	exports.initFactory = initFactory;
	exports.isOperator = isOperator;
	exports.operatorInstance = operatorInstance;
	exports.StopPlanOutException = StopPlanOutException;
	exports.registerOperators = registerOperators;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Return = exports.Length = exports.Max = exports.Min = exports.Negative = exports.Not = exports.Round = exports.Divide = exports.Mod = exports.GreaterThanOrEqualTo = exports.LessThanOrEqualTo = exports.LessThan = exports.GreaterThan = exports.Equals = exports.Sum = exports.Product = exports.Or = exports.And = exports.Cond = exports.Index = exports.Coalesce = exports.Map = exports.Arr = exports.Set = exports.Seq = exports.Get = exports.Literal = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(4);

	var _utils = __webpack_require__(14);

	var _utils2 = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Literal = function (_PlanOutOp) {
	  _inherits(Literal, _PlanOutOp);

	  function Literal() {
	    _classCallCheck(this, Literal);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Literal).apply(this, arguments));
	  }

	  _createClass(Literal, [{
	    key: "execute",
	    value: function execute(mapper) {
	      return this.getArgMixed('value');
	    }
	  }]);

	  return Literal;
	}(_base.PlanOutOp);

	var Get = function (_PlanOutOp2) {
	  _inherits(Get, _PlanOutOp2);

	  function Get() {
	    _classCallCheck(this, Get);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Get).apply(this, arguments));
	  }

	  _createClass(Get, [{
	    key: "execute",
	    value: function execute(mapper) {
	      return mapper.get(this.getArgString('var'));
	    }
	  }]);

	  return Get;
	}(_base.PlanOutOp);

	var Seq = function (_PlanOutOp3) {
	  _inherits(Seq, _PlanOutOp3);

	  function Seq() {
	    _classCallCheck(this, Seq);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Seq).apply(this, arguments));
	  }

	  _createClass(Seq, [{
	    key: "execute",
	    value: function execute(mapper) {
	      (0, _utils2.forEach)(this.getArgList('seq'), function (op) {
	        mapper.evaluate(op);
	      });
	    }
	  }]);

	  return Seq;
	}(_base.PlanOutOp);

	var Return = function (_PlanOutOp4) {
	  _inherits(Return, _PlanOutOp4);

	  function Return() {
	    _classCallCheck(this, Return);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Return).apply(this, arguments));
	  }

	  _createClass(Return, [{
	    key: "execute",
	    value: function execute(mapper) {
	      var value = mapper.evaluate(this.getArgMixed('value'));
	      var inExperiment = false;
	      if (value) {
	        inExperiment = true;
	      }
	      throw new _utils.StopPlanOutException(inExperiment);
	    }
	  }]);

	  return Return;
	}(_base.PlanOutOp);

	var Set = function (_PlanOutOp5) {
	  _inherits(Set, _PlanOutOp5);

	  function Set() {
	    _classCallCheck(this, Set);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Set).apply(this, arguments));
	  }

	  _createClass(Set, [{
	    key: "execute",
	    value: function execute(mapper) {
	      var variable = this.getArgString('var');
	      var value = this.getArgMixed('value');
	      if (mapper.hasOverride(variable)) {
	        return;
	      }

	      if ((0, _utils.isOperator)(value) && !value.salt) {
	        value.salt = variable;
	      }

	      if (variable == "experimentSalt") {
	        mapper.experimentSalt = value;
	      }
	      mapper.set(variable, mapper.evaluate(value));
	    }
	  }]);

	  return Set;
	}(_base.PlanOutOp);

	var Arr = function (_PlanOutOp6) {
	  _inherits(Arr, _PlanOutOp6);

	  function Arr() {
	    _classCallCheck(this, Arr);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Arr).apply(this, arguments));
	  }

	  _createClass(Arr, [{
	    key: "execute",
	    value: function execute(mapper) {
	      return (0, _utils2.map)(this.getArgList('values'), function (value) {
	        return mapper.evaluate(value);
	      });
	    }
	  }]);

	  return Arr;
	}(_base.PlanOutOp);

	var Coalesce = function (_PlanOutOp7) {
	  _inherits(Coalesce, _PlanOutOp7);

	  function Coalesce() {
	    _classCallCheck(this, Coalesce);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Coalesce).apply(this, arguments));
	  }

	  _createClass(Coalesce, [{
	    key: "execute",
	    value: function execute(mapper) {
	      var values = this.getArgList('values');
	      for (var i = 0; i < values.length; i++) {
	        var x = values[i];
	        var evalX = mapper.evaluate(x);
	        if (evalX !== null && evalX !== undefined) {
	          return evalX;
	        }
	      }
	      return null;
	    }
	  }]);

	  return Coalesce;
	}(_base.PlanOutOp);

	var Index = function (_PlanOutOpSimple) {
	  _inherits(Index, _PlanOutOpSimple);

	  function Index() {
	    _classCallCheck(this, Index);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Index).apply(this, arguments));
	  }

	  _createClass(Index, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var base = this.getArgIndexish('base');
	      var index = this.getArgMixed('index');
	      if (typeof index === "number") {
	        if (index >= 0 && index < base.length) {
	          return base[index];
	        } else {
	          return undefined;
	        }
	      } else {
	        return base[index];
	      }
	    }
	  }]);

	  return Index;
	}(_base.PlanOutOpSimple);

	var Cond = function (_PlanOutOp8) {
	  _inherits(Cond, _PlanOutOp8);

	  function Cond() {
	    _classCallCheck(this, Cond);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Cond).apply(this, arguments));
	  }

	  _createClass(Cond, [{
	    key: "execute",
	    value: function execute(mapper) {
	      var list = this.getArgList('cond');
	      for (var i in list) {
	        var ifClause = list[i]['if'];
	        var thenClause = list[i]['then'];
	        if (mapper.evaluate(ifClause)) {
	          return mapper.evaluate(thenClause);
	        }
	      }
	      return null;
	    }
	  }]);

	  return Cond;
	}(_base.PlanOutOp);

	var And = function (_PlanOutOp9) {
	  _inherits(And, _PlanOutOp9);

	  function And() {
	    _classCallCheck(this, And);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(And).apply(this, arguments));
	  }

	  _createClass(And, [{
	    key: "execute",
	    value: function execute(mapper) {
	      return (0, _utils2.reduce)(this.getArgList('values'), function (ret, clause) {
	        if (!ret) {
	          return ret;
	        }

	        return Boolean(mapper.evaluate(clause));
	      }, true);
	    }
	  }]);

	  return And;
	}(_base.PlanOutOp);

	var Or = function (_PlanOutOp10) {
	  _inherits(Or, _PlanOutOp10);

	  function Or() {
	    _classCallCheck(this, Or);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Or).apply(this, arguments));
	  }

	  _createClass(Or, [{
	    key: "execute",
	    value: function execute(mapper) {
	      return (0, _utils2.reduce)(this.getArgList('values'), function (ret, clause) {
	        if (ret) {
	          return ret;
	        }

	        return Boolean(mapper.evaluate(clause));
	      }, false);
	    }
	  }]);

	  return Or;
	}(_base.PlanOutOp);

	var Product = function (_PlanOutOpCommutative) {
	  _inherits(Product, _PlanOutOpCommutative);

	  function Product() {
	    _classCallCheck(this, Product);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Product).apply(this, arguments));
	  }

	  _createClass(Product, [{
	    key: "commutativeExecute",
	    value: function commutativeExecute(values) {
	      return (0, _utils2.reduce)(values, function (memo, value) {
	        return memo * value;
	      }, 1);
	    }
	  }]);

	  return Product;
	}(_base.PlanOutOpCommutative);

	var Sum = function (_PlanOutOpCommutative2) {
	  _inherits(Sum, _PlanOutOpCommutative2);

	  function Sum() {
	    _classCallCheck(this, Sum);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Sum).apply(this, arguments));
	  }

	  _createClass(Sum, [{
	    key: "commutativeExecute",
	    value: function commutativeExecute(values) {
	      return (0, _utils2.reduce)(values, function (memo, value) {
	        return memo + value;
	      }, 0);
	    }
	  }]);

	  return Sum;
	}(_base.PlanOutOpCommutative);

	var Equals = function (_PlanOutOpBinary) {
	  _inherits(Equals, _PlanOutOpBinary);

	  function Equals() {
	    _classCallCheck(this, Equals);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Equals).apply(this, arguments));
	  }

	  _createClass(Equals, [{
	    key: "getInfixString",
	    value: function getInfixString() {
	      return "==";
	    }
	  }, {
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return left === right;
	    }
	  }]);

	  return Equals;
	}(_base.PlanOutOpBinary);

	var GreaterThan = function (_PlanOutOpBinary2) {
	  _inherits(GreaterThan, _PlanOutOpBinary2);

	  function GreaterThan() {
	    _classCallCheck(this, GreaterThan);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(GreaterThan).apply(this, arguments));
	  }

	  _createClass(GreaterThan, [{
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return left > right;
	    }
	  }]);

	  return GreaterThan;
	}(_base.PlanOutOpBinary);

	var LessThan = function (_PlanOutOpBinary3) {
	  _inherits(LessThan, _PlanOutOpBinary3);

	  function LessThan() {
	    _classCallCheck(this, LessThan);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(LessThan).apply(this, arguments));
	  }

	  _createClass(LessThan, [{
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return left < right;
	    }
	  }]);

	  return LessThan;
	}(_base.PlanOutOpBinary);

	var LessThanOrEqualTo = function (_PlanOutOpBinary4) {
	  _inherits(LessThanOrEqualTo, _PlanOutOpBinary4);

	  function LessThanOrEqualTo() {
	    _classCallCheck(this, LessThanOrEqualTo);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(LessThanOrEqualTo).apply(this, arguments));
	  }

	  _createClass(LessThanOrEqualTo, [{
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return left <= right;
	    }
	  }]);

	  return LessThanOrEqualTo;
	}(_base.PlanOutOpBinary);

	var GreaterThanOrEqualTo = function (_PlanOutOpBinary5) {
	  _inherits(GreaterThanOrEqualTo, _PlanOutOpBinary5);

	  function GreaterThanOrEqualTo() {
	    _classCallCheck(this, GreaterThanOrEqualTo);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(GreaterThanOrEqualTo).apply(this, arguments));
	  }

	  _createClass(GreaterThanOrEqualTo, [{
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return left >= right;
	    }
	  }]);

	  return GreaterThanOrEqualTo;
	}(_base.PlanOutOpBinary);

	var Mod = function (_PlanOutOpBinary6) {
	  _inherits(Mod, _PlanOutOpBinary6);

	  function Mod() {
	    _classCallCheck(this, Mod);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Mod).apply(this, arguments));
	  }

	  _createClass(Mod, [{
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return left % right;
	    }
	  }]);

	  return Mod;
	}(_base.PlanOutOpBinary);

	var Divide = function (_PlanOutOpBinary7) {
	  _inherits(Divide, _PlanOutOpBinary7);

	  function Divide() {
	    _classCallCheck(this, Divide);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Divide).apply(this, arguments));
	  }

	  _createClass(Divide, [{
	    key: "binaryExecute",
	    value: function binaryExecute(left, right) {
	      return parseFloat(left) / parseFloat(right);
	    }
	  }]);

	  return Divide;
	}(_base.PlanOutOpBinary);

	var Round = function (_PlanOutOpUnary) {
	  _inherits(Round, _PlanOutOpUnary);

	  function Round() {
	    _classCallCheck(this, Round);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Round).apply(this, arguments));
	  }

	  _createClass(Round, [{
	    key: "unaryExecute",
	    value: function unaryExecute(value) {
	      return Math.round(value);
	    }
	  }]);

	  return Round;
	}(_base.PlanOutOpUnary);

	var Not = function (_PlanOutOpUnary2) {
	  _inherits(Not, _PlanOutOpUnary2);

	  function Not() {
	    _classCallCheck(this, Not);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Not).apply(this, arguments));
	  }

	  _createClass(Not, [{
	    key: "getUnaryString",
	    value: function getUnaryString() {
	      return '!';
	    }
	  }, {
	    key: "unaryExecute",
	    value: function unaryExecute(value) {
	      return !value;
	    }
	  }]);

	  return Not;
	}(_base.PlanOutOpUnary);

	var Negative = function (_PlanOutOpUnary3) {
	  _inherits(Negative, _PlanOutOpUnary3);

	  function Negative() {
	    _classCallCheck(this, Negative);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Negative).apply(this, arguments));
	  }

	  _createClass(Negative, [{
	    key: "getUnaryString",
	    value: function getUnaryString() {
	      return '-';
	    }
	  }, {
	    key: "unaryExecute",
	    value: function unaryExecute(value) {
	      return 0 - value;
	    }
	  }]);

	  return Negative;
	}(_base.PlanOutOpUnary);

	var Min = function (_PlanOutOpCommutative3) {
	  _inherits(Min, _PlanOutOpCommutative3);

	  function Min() {
	    _classCallCheck(this, Min);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Min).apply(this, arguments));
	  }

	  _createClass(Min, [{
	    key: "commutativeExecute",
	    value: function commutativeExecute(values) {
	      return Math.min.apply(null, values);
	    }
	  }]);

	  return Min;
	}(_base.PlanOutOpCommutative);

	var Max = function (_PlanOutOpCommutative4) {
	  _inherits(Max, _PlanOutOpCommutative4);

	  function Max() {
	    _classCallCheck(this, Max);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Max).apply(this, arguments));
	  }

	  _createClass(Max, [{
	    key: "commutativeExecute",
	    value: function commutativeExecute(values) {
	      return Math.max.apply(null, values);
	    }
	  }]);

	  return Max;
	}(_base.PlanOutOpCommutative);

	var Length = function (_PlanOutOpUnary4) {
	  _inherits(Length, _PlanOutOpUnary4);

	  function Length() {
	    _classCallCheck(this, Length);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Length).apply(this, arguments));
	  }

	  _createClass(Length, [{
	    key: "unaryExecute",
	    value: function unaryExecute(value) {
	      return value.length;
	    }
	  }]);

	  return Length;
	}(_base.PlanOutOpUnary);

	var Map = function (_PlanOutOpSimple2) {
	  _inherits(Map, _PlanOutOpSimple2);

	  function Map() {
	    _classCallCheck(this, Map);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Map).apply(this, arguments));
	  }

	  _createClass(Map, [{
	    key: "simpleExecute",
	    value: function simpleExecute() {
	      var copy = (0, _utils2.deepCopy)(this.args);
	      delete copy.op;
	      delete copy.salt;
	      return copy;
	    }
	  }]);

	  return Map;
	}(_base.PlanOutOpSimple);

	exports.Literal = Literal;
	exports.Get = Get;
	exports.Seq = Seq;
	exports.Set = Set;
	exports.Arr = Arr;
	exports.Map = Map;
	exports.Coalesce = Coalesce;
	exports.Index = Index;
	exports.Cond = Cond;
	exports.And = And;
	exports.Or = Or;
	exports.Product = Product;
	exports.Sum = Sum;
	exports.Equals = Equals;
	exports.GreaterThan = GreaterThan;
	exports.LessThan = LessThan;
	exports.LessThanOrEqualTo = LessThanOrEqualTo;
	exports.GreaterThanOrEqualTo = GreaterThanOrEqualTo;
	exports.Mod = Mod;
	exports.Divide = Divide;
	exports.Round = Round;
	exports.Not = Not;
	exports.Negative = Negative;
	exports.Min = Min;
	exports.Max = Max;
	exports.Length = Length;
	exports.Return = Return;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SimpleNamespace = exports.Namespace = undefined;

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _experiment = __webpack_require__(1);

	var _experiment2 = _interopRequireDefault(_experiment);

	var _assignment = __webpack_require__(2);

	var _assignment2 = _interopRequireDefault(_assignment);

	var _random = __webpack_require__(3);

	var _utils = __webpack_require__(5);

	var _experimentSetup = __webpack_require__(17);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var DefaultExperiment = function (_Experiment) {
	  _inherits(DefaultExperiment, _Experiment);

	  function DefaultExperiment() {
	    _classCallCheck(this, DefaultExperiment);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DefaultExperiment).apply(this, arguments));
	  }

	  _createClass(DefaultExperiment, [{
	    key: "configureLogger",
	    value: function configureLogger() {
	      return;
	    }
	  }, {
	    key: "setup",
	    value: function setup() {
	      this.name = 'test_name';
	    }
	  }, {
	    key: "log",
	    value: function log(data) {
	      return;
	    }
	  }, {
	    key: "getParamNames",
	    value: function getParamNames() {
	      return this.getDefaultParamNames();
	    }
	  }, {
	    key: "previouslyLogged",
	    value: function previouslyLogged() {
	      return true;
	    }
	  }, {
	    key: "assign",
	    value: function assign(params, args) {
	      return;
	    }
	  }]);

	  return DefaultExperiment;
	}(_experiment2.default);

	var Namespace = function () {
	  function Namespace() {
	    _classCallCheck(this, Namespace);
	  }

	  _createClass(Namespace, [{
	    key: "addExperiment",
	    value: function addExperiment(name, obj, segments) {
	      throw "IMPLEMENT addExperiment";
	    }
	  }, {
	    key: "removeExperiment",
	    value: function removeExperiment(name) {
	      throw "IMPLEMENT removeExperiment";
	    }
	  }, {
	    key: "setAutoExposureLogging",
	    value: function setAutoExposureLogging(value) {
	      throw "IMPLEMENT setAutoExposureLogging";
	    }
	  }, {
	    key: "inExperiment",
	    value: function inExperiment() {
	      throw "IMPLEMENT inExperiment";
	    }
	  }, {
	    key: "get",
	    value: function get(name, defaultVal) {
	      throw "IMPLEMENT get";
	    }
	  }, {
	    key: "logExposure",
	    value: function logExposure(extras) {
	      throw "IMPLEMENT logExposure";
	    }
	  }, {
	    key: "logEvent",
	    value: function logEvent(eventType, extras) {
	      throw "IMPLEMENT logEvent";
	    }
	  }, {
	    key: "requireExperiment",
	    value: function requireExperiment() {
	      if (!this._experiment) {
	        this._assignExperiment();
	      }
	    }
	  }, {
	    key: "requireDefaultExperiment",
	    value: function requireDefaultExperiment() {
	      if (!this._defaultExperiment) {
	        this._assignDefaultExperiment();
	      }
	    }
	  }]);

	  return Namespace;
	}();

	var SimpleNamespace = function (_Namespace) {
	  _inherits(SimpleNamespace, _Namespace);

	  function SimpleNamespace(args) {
	    _classCallCheck(this, SimpleNamespace);

	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SimpleNamespace).call(this, args));

	    _this2.name = _this2.getDefaultNamespaceName();
	    _this2.inputs = args || {};
	    _this2.numSegments = 1;
	    _this2.segmentAllocations = {};
	    _this2.currentExperiments = {};

	    _this2._experiment = null;
	    _this2._defaultExperiment = null;
	    _this2.defaultExperimentClass = DefaultExperiment;
	    _this2._inExperiment = false;

	    _this2.setupDefaults();
	    _this2.setup();
	    _this2.availableSegments = (0, _utils.range)(_this2.numSegments);

	    _this2.setupExperiments();
	    return _this2;
	  }

	  _createClass(SimpleNamespace, [{
	    key: "setupDefaults",
	    value: function setupDefaults() {
	      return;
	    }
	  }, {
	    key: "setup",
	    value: function setup() {
	      throw "IMPLEMENT setup";
	    }
	  }, {
	    key: "setupExperiments",
	    value: function setupExperiments() {
	      throw "IMPLEMENT setupExperiments";
	    }
	  }, {
	    key: "getPrimaryUnit",
	    value: function getPrimaryUnit() {
	      return this._primaryUnit;
	    }
	  }, {
	    key: "allowedOverride",
	    value: function allowedOverride() {
	      return false;
	    }
	  }, {
	    key: "getOverrides",
	    value: function getOverrides() {
	      return {};
	    }
	  }, {
	    key: "setPrimaryUnit",
	    value: function setPrimaryUnit(value) {
	      this._primaryUnit = value;
	    }
	  }, {
	    key: "addExperiment",
	    value: function addExperiment(name, expObject, segments) {
	      var numberAvailable = this.availableSegments.length;
	      if (numberAvailable < segments) {
	        return false;
	      } else if (this.currentExperiments[name] !== undefined) {
	        return false;
	      }
	      var a = new _assignment2.default(this.name);
	      a.set('sampled_segments', new _random.Sample({ 'choices': this.availableSegments, 'draws': segments, 'unit': name }));
	      var sample = a.get('sampled_segments');
	      for (var i = 0; i < sample.length; i++) {
	        this.segmentAllocations[sample[i]] = name;
	        var currentIndex = this.availableSegments.indexOf(sample[i]);
	        this.availableSegments[currentIndex] = this.availableSegments[numberAvailable - 1];
	        this.availableSegments.splice(numberAvailable - 1, 1);
	        numberAvailable -= 1;
	      }
	      this.currentExperiments[name] = expObject;
	    }
	  }, {
	    key: "removeExperiment",
	    value: function removeExperiment(name) {
	      var _this3 = this;

	      if (this.currentExperiments[name] === undefined) {
	        return false;
	      }

	      (0, _utils.forEach)(Object.keys(this.segmentAllocations), function (cur) {
	        if (_this3.segmentAllocations[cur] === name) {
	          delete _this3.segmentAllocations[cur];
	          _this3.availableSegments.push(cur);
	        }
	      });

	      delete this.currentExperiments[name];
	      return true;
	    }
	  }, {
	    key: "getSegment",
	    value: function getSegment() {
	      var a = new _assignment2.default(this.name);
	      var segment = new _random.RandomInteger({ 'min': 0, 'max': this.numSegments - 1, 'unit': this.inputs[this.getPrimaryUnit()] });
	      a.set('segment', segment);
	      return a.get('segment');
	    }
	  }, {
	    key: "_assignExperiment",
	    value: function _assignExperiment() {
	      this.inputs = (0, _utils.extend)(this.inputs, (0, _experimentSetup.getExperimentInputs)(this.getName()));
	      var segment = this.getSegment();

	      if (this.segmentAllocations[segment] !== undefined) {
	        var experimentName = this.segmentAllocations[segment];
	        this._assignExperimentObject(experimentName);
	      }
	    }
	  }, {
	    key: "_assignExperimentObject",
	    value: function _assignExperimentObject(experimentName) {
	      var experiment = new this.currentExperiments[experimentName](this.inputs);
	      experiment.setName(this.getName() + "-" + experimentName);
	      experiment.setSalt(this.getName() + "-" + experimentName);
	      this._experiment = experiment;
	      this._inExperiment = experiment.inExperiment();
	      if (!this._inExperiment) {
	        this._assignDefaultExperiment();
	      }
	    }
	  }, {
	    key: "_assignDefaultExperiment",
	    value: function _assignDefaultExperiment() {
	      this._defaultExperiment = new this.defaultExperimentClass(this.inputs);
	    }
	  }, {
	    key: "defaultGet",
	    value: function defaultGet(name, default_val) {
	      _get(Object.getPrototypeOf(SimpleNamespace.prototype), "requireDefaultExperiment", this).call(this);
	      return this._defaultExperiment.get(name, default_val);
	    }
	  }, {
	    key: "getName",
	    value: function getName() {
	      return this.name;
	    }
	  }, {
	    key: "setName",
	    value: function setName(name) {
	      this.name = name;
	    }
	  }, {
	    key: "previouslyLogged",
	    value: function previouslyLogged() {
	      if (this._experiment) {
	        return this._experiment.previouslyLogged();
	      }
	      return null;
	    }
	  }, {
	    key: "inExperiment",
	    value: function inExperiment() {
	      _get(Object.getPrototypeOf(SimpleNamespace.prototype), "requireExperiment", this).call(this);
	      return this._inExperiment;
	    }
	  }, {
	    key: "setAutoExposureLogging",
	    value: function setAutoExposureLogging(value) {
	      this._autoExposureLoggingSet = value;
	      if (this._defaultExperiment) {
	        this._defaultExperiment.setAutoExposureLogging(value);
	      }
	      if (this._experiment) {
	        this._experiment.setAutoExposureLogging(value);
	      }
	    }
	  }, {
	    key: "setGlobalOverride",
	    value: function setGlobalOverride(name) {
	      var globalOverrides = this.getOverrides();
	      if (globalOverrides && (0, _utils.hasKey)(globalOverrides, name)) {
	        var overrides = globalOverrides[name];
	        if (overrides && (0, _utils.hasKey)(this.currentExperiments, overrides.experimentName)) {
	          this._assignExperimentObject(overrides.experimentName);
	          this._experiment.addOverride(name, overrides.value);
	        }
	      }
	    }
	  }, {
	    key: "setLocalOverride",
	    value: function setLocalOverride(name) {
	      var experimentName = (0, _utils.getParameterByName)('experimentOverride');
	      if (experimentName && (0, _utils.hasKey)(this.currentExperiments, experimentName)) {
	        this._assignExperimentObject(experimentName);
	        if ((0, _utils.getParameterByName)(name)) {
	          this._experiment.addOverride(name, (0, _utils.getParameterByName)(name));
	        }
	      }
	    }
	  }, {
	    key: "getParams",
	    value: function getParams(experimentName) {
	      _get(Object.getPrototypeOf(SimpleNamespace.prototype), "requireExperiment", this).call(this);
	      if (this._experiment && this.getOriginalExperimentName() === experimentName) {
	        return this._experiment.getParams();
	      } else {
	        return null;
	      }
	    }
	  }, {
	    key: "getOriginalExperimentName",
	    value: function getOriginalExperimentName() {
	      if (this._experiment) {
	        return this._experiment.getName().split('-')[1];
	      }
	      return null;
	    }
	  }, {
	    key: "get",
	    value: function get(name, defaultVal) {
	      _get(Object.getPrototypeOf(SimpleNamespace.prototype), "requireExperiment", this).call(this);
	      if (this.allowedOverride()) {
	        this.setGlobalOverride(name);
	      }
	      this.setLocalOverride(name);

	      if (!this._experiment) {
	        return this.defaultGet(name, defaultVal);
	      } else {
	        if (this._autoExposureLoggingSet !== undefined) {
	          this._experiment.setAutoExposureLogging(this._autoExposureLoggingSet);
	        }
	        return this._experiment.get(name, this.defaultGet(name, defaultVal));
	      }
	    }
	  }, {
	    key: "logExposure",
	    value: function logExposure(extras) {
	      _get(Object.getPrototypeOf(SimpleNamespace.prototype), "requireExperiment", this).call(this);
	      if (!this._experiment) {
	        return;
	      }
	      this._experiment.logExposure(extras);
	    }
	  }, {
	    key: "logEvent",
	    value: function logEvent(eventType, extras) {
	      _get(Object.getPrototypeOf(SimpleNamespace.prototype), "requireExperiment", this).call(this);
	      if (!this._experiment) {
	        return;
	      }
	      this._experiment.logEvent(eventType, extras);
	    }

	    //helper function to return the class name of the current experiment class

	  }, {
	    key: "getDefaultNamespaceName",
	    value: function getDefaultNamespaceName() {
	      if ((0, _utils.isObject)(this) && this.constructor && this !== this.window) {
	        var arr = this.constructor.toString().match(/function\s*(\w+)/);
	        if (arr && arr.length === 2) {
	          return arr[1];
	        }
	      }
	      return "GenericNamespace";
	    }
	  }]);

	  return SimpleNamespace;
	}(Namespace);

	exports.Namespace = Namespace;
	exports.SimpleNamespace = SimpleNamespace;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(5);

	var globalInputArgs = {};
	var experimentSpecificInputArgs = {};

	var fetchInputs = function fetchInputs(args) {
	  if (!args) {
	    return {};
	  }

	  return resolveArgs((0, _utils.shallowCopy)(args));
	};

	var resolveArgs = function resolveArgs(args) {
	  (0, _utils.forEach)(Object.keys(args), function (key) {
	    if ((0, _utils.isFunction)(args[key])) {
	      args[key] = args[key]();
	    }
	  });
	  return args;
	};

	var registerExperimentInput = function registerExperimentInput(key, value, experimentName) {
	  if (!experimentName) {
	    globalInputArgs[key] = value;
	  } else {
	    if (!experimentSpecificInputArgs[experimentName]) {
	      experimentSpecificInputArgs[experimentName] = {};
	    }
	    experimentSpecificInputArgs[experimentName][key] = value;
	  }
	};

	var getExperimentInputs = function getExperimentInputs(experimentName) {
	  var inputArgs = fetchInputs(globalInputArgs);
	  if (experimentName && experimentSpecificInputArgs[experimentName]) {
	    return (0, _utils.extend)(inputArgs, fetchInputs(experimentSpecificInputArgs[experimentName]));
	  }
	  return inputArgs;
	};

	exports.default = { registerExperimentInput: registerExperimentInput, getExperimentInputs: getExperimentInputs };
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;