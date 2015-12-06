var express = require('express');
var app = express();
var planout = require('../dist/planout.js');

/* This is basically a way to easily extend classes in ES5 - source: https://gist.github.com/juandopazo/1367191 */
Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
  var descriptors = {};
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      descriptors[prop] = Object.getOwnPropertyDescriptor(obj, prop);
    }
  }
  return descriptors;
};
 
Function.prototype.extend = function extend(proto) {
    var superclass = this;
    var constructor;
 
    if (!proto.hasOwnProperty('constructor')) {
      Object.defineProperty(proto, 'constructor', {
        value: function () {
            // Default call to superclass as in maxmin classes
            superclass.apply(this, arguments);
        },
        writable: true,
        configurable: true,
        enumerable: false
      });
    }
    constructor = proto.constructor;
    
    constructor.prototype = Object.create(this.prototype, Object.getOwnPropertyDescriptors(proto));
    
    return constructor;
};


/* End extend helper */

var compiledScript = {"op":"seq",
       "seq": [
        {"op":"set",
         "var":"foo",
         "value":{
           "choices":["Choice A","Choice B"],
           "op":"uniformChoice",
           "unit": {"op": "get", "var": "id"}
           }
        },
        {"op":"set",
         "var":"bar",
         "value": 41
        }
      ]
    };

/* Using this class the experiment serialization is passed down to the class at initialization, presumably because
   it's been loaded with all other experiment definitions using a network request where you only want to make a one time request 
   for all currently running experiments and lazily evaluate them as needed. This approach works well for client-side apps.
*/
var LazyInterpretedExperiment = planout.Interpreter.extend({
  constructor: function(args) {
    Object.getPrototypeOf(LazyInterpretedExperiment.prototype).constructor.call(this, args.serialization, args.salt, args.inputs);
    this._exposureLogged = false;
    this.setAutoExposureLogging(true);
  },

  requireExposureLogging: function() {
    if (this.shouldLogExposure()) {
      this.logExposure();
    }
  },

  getName: function() {
    return this.name;
  },

  shouldLogExposure: function() {
    return this._autoExposureLog && !this.previouslyLogged();
  },

  setAutoExposureLogging: function(value) {
    this._autoExposureLog = value;
  },

  getExpParam: function(param) {
    this.requireExposureLogging();
    //super.getParams() caches results so no need to do it here
    return Object.getPrototypeOf(LazyInterpretedExperiment.prototype).getParams.call(this)[param];
  },

  logExposure: function(extras) {
    return;
  },

  logEvent: function(event, extras) {
    return;
  },

  previouslyLogged: function() {
    return this._exposureLogged;
  }
});

/* Using this class the experiment serialization is loaded when the experiment parameters are requested, presumably because
  they can be quickly loaded from the local filesystem or an inexpensive database query. This approach works well for server-side apps.
*/

var EagerInterpretedExperiment = planout.Experiment.extend({
  setup: function() {
    this.name = "SampleExperiment";
  },
  loadScript: function() { 

    /* here you can read from the database, filesystem, etc. */
    return compiledScript;
  },
  assign: function(params, args) {
    this.script = this.loadScript();
    interpreterInstance = new planout.Interpreter(
        this.script,
        this.getSalt(),
        args
    )
    var results = interpreterInstance.getParams()
    Object.keys(results).forEach(function(result) {
      params.set(result, results[result]);
    });
    return interpreterInstance.inExperiment
  },
  configureLogger: function() {
    return;
  },
  log: function(stuff) {
    return;
  },
  getParamNames: function() {
    return this.getDefaultParamNames();
  },
  previouslyLogged: function() {
    return this._exposureLogged;
  }
});


app.get('/', function (req, res) {
  var inputs = {'id': req.connection.remoteAddress};
  var lazyExperiment = new LazyInterpretedExperiment({ 'serialization': compiledScript, 'salt': 'SampleExperiment', 'inputs': inputs});
  var eagerExperiment = new EagerInterpretedExperiment(inputs);
  res.send('<html><body>' + lazyExperiment.getExpParam('foo') + '<br>' + eagerExperiment.get('foo') + '</body></html>');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
