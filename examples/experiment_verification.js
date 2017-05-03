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

var Experiment1 = planout.Experiment.extend({
  setup: function() { 
    this.setName("Exp1");
    this.setSalt("Exp1"); 
  },
  assign: function(params, args) {
    params.set('group_size', new planout.Ops.Random.UniformChoice({ 'choices': [1, 10], 'unit': args.userid}));
    params.set('specific_goal', new planout.Ops.Random.BernoulliTrial({'p': 0.8, 'unit': args.userid}));
    if (params.get('specific_goal')) {
      params.set('ratings_per_user_goal', new planout.Ops.Random.UniformChoice({ 'choices': [8, 16, 32, 64], 'unit': args.userid}));
      params.set('ratings_goal', params.get('group_size') * params.get('ratings_per_user_goal'));
    }
  },
  getParamNames: function() { return this.getDefaultParamNames(); },
  configureLogger: function() { return; },
  log: function(stuff) { return; },
  previouslyLogged: function() { return; },
});

var Experiment3 = planout.Experiment.extend({
  setup: function() { 
    this.setName("Exp3");
    this.setSalt("Exp3"); 
  },
  assign: function(params, args) {
    params.set('has_banner', new planout.Ops.Random.BernoulliTrial({ 'p': 0.97, 'unit': args.userid}));
    var cond_probs = [0.5, 0.95];
    params.set('has_feed_stories', new planout.Ops.Random.BernoulliTrial({'p': cond_probs[params.get('has_banner')], 'unit': args.userid}));
    params.set('button_text', new planout.Ops.Random.UniformChoice({'choices': ["I'm a voter", "I'm voting"], 'unit': args.userid}))
  },
  getParamNames: function() { return this.getDefaultParamNames(); },
  configureLogger: function() { return; },
  log: function(stuff) { return; },
  previouslyLogged: function() { return; },
});

var experiment1_results = [];
for (var i = 0; i < 10; i++) {
  var exp = new Experiment1({'userid': i});
  experiment1_results.push([exp.get('group_size'), exp.get('ratings_goal')]);
}

var experiment3_results = [];
for (var i =0 ; i < 5; i++) {
  var exp = new Experiment3({'userid': i});
  experiment3_results.push([exp.get('button_text')]);
}

app.get('/', function (req, res) {
  res.send('Experiment 1 results ' + experiment1_results + '<br>Experiment 3 results ' + experiment3_results);
});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
